import { Page, IPage } from './page';
import cache from '../../cache/data.json';

export enum Color {
  Green = 'green',
  Brown = 'brown',
  Tan = 'tan',
  Yellow = 'yellow',
  Red = 'red',
  White = 'white',
  Pale = 'pale',
  Orange = 'orange',
  Black = 'black',
  Blue = 'blue',
  Indigo = 'indigo',
  Dark = 'dark',
  None = 'none',
  Pink = 'pink',
  Peach = 'peach',
  Silver = 'silver',
  Purple = 'purple',
  Blonde = 'blonde',
  Blond = 'blond',
  Hazel = 'hazel',
  Grey = 'grey',
  Gray = 'gray',
  Amber = 'amber',
  Magenta = 'magenta',
  PalePink = 'pale pink',
  Fair = 'fair',
  Gold = 'gold',
  Golden = 'golden',
  Auburn = 'auburn',
  GreenTan = 'green-tan',
  BlueGray = 'blue-gray',
  BrownMottle = 'brown mottle',
  MottledGreen = 'mottled green',
  Metal = 'metal',
  Light = 'light',
  Caucasian = 'caucasian',
  Asian = 'asian',
  Hispanic = 'hispanic',
  NotAvailable = 'n/a',
  Unknown = 'unknown',
}

export function toColors(color: string): Color[] {
  return color.split(',').map((c) => {
    let value = Object.values(Color).includes(c.trim() as Color) ? c.trim() as Color : undefined;
    if (!value) { throw `Unknown Color: '${c}'` }
    return value;
  });
}

export enum Language {
  Galactic = 'GALACTIC BASIC',
  Dosh = 'DOSH',
  MonCalamarian = 'MON CALAMARIAN',
  Ewokese = 'EWOKESE',
  Sullutese = 'SULLUTESE',
  Neimoidia = 'NEIMOIDIA',
  Gungan = 'GUNGAN BASIC',
  Toydarian = 'TOYDARIAN',
  Dugese = 'DUGESE',
  Huttese = 'HUTTESE',
  Twileki = "TWI'LEKI",
  Aleena = 'ALEENA',
  Vulpterish = 'VULPTERISH',
  Xextese = 'XEXTESE',
  Tundan = 'TUNDAN',
  Cerean = 'CEREAN',
  Nautila = 'NAUTILA',
  Zabraki = 'ZABRAKI',
  Iktotchese = 'IKTOTCHESE',
  Quermian = 'QUERMIAN',
  Togruti = 'TOGRUTI',
  Kaleesh = 'KALEESH',
  KelDor = 'KEL DOR',
  Chagria = 'CHAGRIA',
  Geonosian = 'GEONOSIAN',
  Mirialan = 'MIRIALAN',
  Clawdite = 'CLAWDITE',
  Besalisk = 'BESALISK',
  Kaminoan = 'KAMINOAN',
  Skakoan = 'SKAKOAN',
  Muun = 'MUUN',
  Utapese = 'UTAPESE',
  Shyriiwook = 'SHYRIIWOOK',
  NotAvailable = 'N/A',
  Unknown = 'UNKNOWN',
}

export function toLanguage(s: string): Language {
  let language = Object.values(Language).includes(s.trim().toUpperCase() as Language) ? s.trim().toUpperCase() as Language : undefined;
  if (!language) { throw `Unknown Language: '${s}' out of: ${Object.values(Language)}` };
  return language;
}

export enum SWCalendar {
  BBY,
  LY,
  CRC,
}

export interface SWYear {
  value: number
  calendar: SWCalendar
}

export function toYear(s: string): SWYear {
  if (s.endsWith('BBY')) {
    return { value: parseInt(s.replace('BBY', '')), calendar: SWCalendar.BBY };
  } else if (s.endsWith('LY')) {
    return { value: parseInt(s.replace('LY', '')), calendar: SWCalendar.LY };
  } else if (s.endsWith('CRC')) {
    return { value: parseInt(s.replace('CRC', '')), calendar: SWCalendar.CRC };
  } else {
    throw `Unsupported Star Wars Year: '${s}'`
  }
}

export function fromYear(year: SWYear): string {
  return `${year.value}${SWCalendar[year.calendar]}`;
}

export class Base {
  id: number

  constructor(properties: { [s: string]: any }) {
    this.id = 0;
  }

  static cacheKeyName(): string {
    throw 'Must implement cacheKeyName()';
  }

  static all<T extends Base>(...ids: number[]): T[] {
    console.log(`${this.name}.all(${ids})`);
    let key = `https://swapi.co/api/${this.cacheKeyName()}/`;
    let objs: T[] = [];
    //@ts-ignore
    let page = cache[key].results;
    objs = objs.concat(page.map((p: T) => new this(p)));
    let pageNumber = 2;
    do {
      key = `https://swapi.co/api/${this.cacheKeyName()}/?page=${pageNumber}`;
      //@ts-ignore
      page = (cache[key] || {}).results;
      if (page != undefined) {
        objs = objs.concat(page.map((p: T) => new this(p)));
      }
      pageNumber++;
    } while (page != undefined);

    if (ids.length == 0) {
      return objs;
    } else {
      return objs.filter((o: T) => ids.includes(o.id));
    }
  }

  static list<T extends Base>(pageNumber: number = 0): Page<T> | null {
    console.log(`${this.name}.list(${pageNumber})`);
    if (pageNumber == 0) {
      let key = `https://swapi.co/api/${this.cacheKeyName()}/`;
      //@ts-ignore
      let page: IPage<T> = cache[key];
      return new Page<T>(this, page);
    } else {
      //@ts-ignore
      let page: IPage<T> = cache[`https://swapi.co/api/${this.cacheKeyName()}/?page=${pageNumber}`];
      if (page != undefined) {
        return new Page<T>(this, page);
      } else {
        return null;
      }
    }
  }

  static find<T extends Base>(key: string | number | undefined): T | null {
    console.log(`${this.name}.find(${key})`);
    let cacheKey = `https://swapi.co/api/${this.cacheKeyName()}/${key}/`;
    //@ts-ignore
    let obj = cache[cacheKey];
    if (obj != undefined) {
      //@ts-ignore
      return new this(obj);
    } else {
      return null;
    }
  }

  findRelation<T extends Base>(keys: string[], type: typeof Base): T[] {
    console.log(`${this.constructor.name}.findRelation(keys, ${type.name})`);
    let relation = (keys || []).map((key) => {
      let keyId = this.parseIdentifier(key);
      //@ts-ignore
      return type.find(keyId);
    });
    //@ts-ignore
    return relation.filter(function notEmpty<TValue>(value: TValue | null): value is TValue { return value !== null });
  }

  parseIdentifier(url: string): number {
    return Base.parseIdentifier(url);
  }

  static parseIdentifier(url: string): number {
    let keyId = url.match(/\/(\d+)\//);
    if (keyId != null) {
      // keyId[0] == '/123/' and keyId[1] == '123'
      return parseInt(keyId[1]);
    }
    throw `Attempt to parse URL to find identifier failed for URL: ${url}`;
  }
}