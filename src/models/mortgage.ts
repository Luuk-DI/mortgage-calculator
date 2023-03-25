import { reactive, ref } from 'vue';

export class Mortgage {
  constructor(
    loan: number,
    rate: number,
    WOZ: number,
  ) {
    this._values.loan = loan;
    this._values.rate = rate;
    this._values.woz = WOZ;

    this.updateRates();
  }

  private _values = reactive({
    loan: 0,
    rate: 0,
    woz: 0,
  });

  get values() {
    return this._values;
  }

  monthly = ref(0);
  nettMonthly = ref(0);

  get loan() {
    return this._values.loan;
  }
  set loan(v) {
    this._values.loan = v;
    this.updateRates();
  }

  get rate() {
    return this._values.rate;
  }
  set rate(v) {
    this._values.rate = v;
    this.updateRates();
  }

  get woz() {
    return this._values.woz;
  }
  set woz(v) {
    this._values.woz = v;
    this.updateRates();
  }

  get interest() {
    return this.loan * this.rate / 100;
  }

  private updateRates() {
    if (this.loan <= 0) {
      this.monthly.value = 0;
      this.nettMonthly.value = 0;
    } else {
      this.monthly.value = this.findMonthlyRate();
      this.nettMonthly.value = this.findNettRate();
    }
  }

  private hypotheekrenteAftrek() {
    return (this.interest - 0.0035 * this.woz) * 0.3693;
  }

  private findNettRate() {
    return round(this.monthly.value - this.hypotheekrenteAftrek() / 12, 2);
  }

  private findMonthlyRate() {
    let monthly = (this.loan / 360) + this.interest / 10;
    let remainder = 0;
    let steps = 0;

    do {
      remainder = this.findRemainder(monthly);

      monthly += remainder / 720;
      steps++;
    } while (Math.abs(remainder) > this.loan / 100_000);

    console.debug(`Found rate in ${steps} steps`);

    return round(monthly, 2);
  }

  private findRemainder(monthly: number) {
    let remainder = this.loan;

    for (let i = 0; i < 360; i++) {
      remainder -= (monthly - remainder * this.rate / 12 / 100);
    }

    return remainder;
  }
}

export function round(value: number, precision: number) {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}
