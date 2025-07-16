import { createVaporApp, type VaporComponent } from 'vue';
import App from './App.vue';

import './index.css';

createVaporApp(App as VaporComponent).mount('#app');
