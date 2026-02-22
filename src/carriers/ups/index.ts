import { registerCarrier } from '../registry';
import { UPSCarrier } from './ups-carrier';
import { loadUPSConfig } from './ups-config';

registerCarrier('ups', (http) => new UPSCarrier(loadUPSConfig(), http));
