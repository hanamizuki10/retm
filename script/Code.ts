import { doGet } from './functions/doGet';
import { include } from './functions/include';
import { getSampleString } from './functions/getSampleString';  // TODO :仮
import { getHolidays } from './functions/getHolidays';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let global: any;

global.doGet = doGet;
global.include = include;
global.getSampleString = getSampleString;   // TODO:あとで削除仮
global.getHolidays = getHolidays;
