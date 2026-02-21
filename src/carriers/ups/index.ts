import { registerCarrier } from '../registry';
import { UPSCarrier } from './ups-carrier';
import { loadUPSConfig } from './config';

registerCarrier('ups', (http) => new UPSCarrier(loadUPSConfig(), http));
