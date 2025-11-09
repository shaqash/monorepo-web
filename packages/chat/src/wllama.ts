import { ModelManager, Wllama } from '@wllama/wllama';
import { CONFIG_PATHS } from './config';

export const wllama = new Wllama(CONFIG_PATHS, { parallelDownloads: 5 });
export const modelManager = new ModelManager({
  parallelDownloads: 5,
});
