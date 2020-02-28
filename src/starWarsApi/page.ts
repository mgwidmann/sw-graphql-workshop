import { Base } from './base';

export interface IPage<T extends Base> {
  count: number
  next?: string | null
  previous?: string | null
  results: T[]
}

export class Page<T extends Base> {
  count: number
  next?: number | null
  previous?: number | null
  results: T[]

  constructor(type: typeof Base, page: IPage<T>) {
    if (page != undefined) {
      this.count = page.count || 0;
      this.next = page.next ? Base.parsePage(page.next) : null;
      this.previous = page.previous ? Base.parsePage(page.previous) : null;
      this.results = (page.results || []).map((r: any) => this.constructResult(type, r));
    } else {
      this.count = 0;
      this.results = [];
    }
  }

  constructResult(type: typeof Base, properties: { [s: string]: any }): T {
    //@ts-ignore
    return new type(properties);
  }
}