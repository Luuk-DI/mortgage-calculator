const STORAGE_KEY = 'mortgage';

export interface SaveModel {
  showSettings: boolean;
  currentMortage: {
    loan: number;
    rate: number;
    woz: number;
  };
  sell: {
    enabled: boolean;
    amount: number;
    agent: number;
    remainingMortgage: number;
  };
  buy: {
    amount: number;
    agent: number;
    bank: number;
    notary: number;
    misc: number;
  };
  newMortgage: {
    rate: number;
    woz: number;
  };
  time?: number;
}

export const defaultSaveValues: SaveModel = {
  showSettings: true,
  currentMortage: {
    loan: 150_000,
    rate: 4,
    woz: 250_000,
  },
  sell: {
    enabled: true,
    amount: 250_000,
    agent: 1.5,
    remainingMortgage: 150_000,
  },
  buy: {
    amount: 500_000,
    agent: 1.5,
    bank: 3000,
    notary: 2000,
    misc: 5000,
  },
  newMortgage: {
    rate: 4,
    woz: 500_000,
  },
};

export function setSave(data: SaveModel) {
  const time = Date.now();

  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    ...data,
    time,
  }));

  return new Date(time);
}

export function loadSave() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored == null) {
    return defaultSaveValues;
  }

  return {
    ...defaultSaveValues,
    ...(JSON.parse(stored) as SaveModel),
  };
}

export function reloadSave() {
  location.reload();
}

export function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}
