import { chatGptPlusService } from './chatGptPlus';
import { geminiProService } from './geminiPro';
import { perplexityProService } from './perplexityPro';
import { veoUltraService } from './veoUltra';
import { canvaProService } from './canvaPro';
import { capcutProService } from './capcutPro';
import type { Service } from '../types';

export const services: Service[] = [
  chatGptPlusService,
  geminiProService,
  perplexityProService,
  veoUltraService,
  canvaProService,
  capcutProService,
];