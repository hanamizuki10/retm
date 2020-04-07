import { doGet } from './functions/doGet';
import { include } from './functions/include';
import { SheetService } from './functions/sheet.service';
import { getSampleString } from './functions/getSampleString';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let global: any;

global.createNewFile = (): void => {
  const ss = SheetService.createInitialFile('New file');
  ss.getRange('A2').setValue('Happy gas!');
};
global.doGet = doGet;
global.include = include;
global.getSampleString = getSampleString;
