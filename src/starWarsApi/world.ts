import { Base } from './base';
import { Person } from './person';
import { Film } from './film';

export enum Climate {
  Temperate = 'temperate',
  ArtificialTemperate = 'artificial temperate',
  Arid = 'arid',
  Tropical = 'tropical',
  Windy = 'windy',
  Frozen = 'frozen',
  Frigid = 'frigid',
  Artic = 'artic',
  Subartic = 'subartic',
  Hot = 'hot',
  Superheated = 'superheated',
  Humid = 'humid',
  Moist = 'moist',
  Murky = 'murky',
  Polluted = 'polluted',
  Unknown = 'unknown',
}

export function toClimates(climateString: string): Climate[] {
  return climateString.split(',').map((c) => {
    let climate = Object.values(Climate).includes(c.trim() as Climate) ? c.trim() as Climate : undefined;
    if (!climate) { throw `Unknown Climate: '${c}' out of: ${Object.values(Climate)}` };
    return climate;
  });
}

export interface WorldProperties {
  name: string
  rotation_period: string
  orbital_period: string
  diameter: string
  climate: string
  gravity: string
  terrain: string
  surface_water: string
  population: string
  residents: string[]
  films: string[]
  url: string
}

export class World extends Base {
  name: string
  rotationPeriod: number
  orbitalPeriod: number
  diameter: number
  climate: Climate[]
  gravity: string
  terrain: string[]
  surfaceWater: number
  population: number
  residentKeys: string[]
  filmKeys: string[]

  constructor(properties: WorldProperties) {
    super({});
    this.id = this.parseIdentifier(properties.url);
    this.name = properties.name;
    this.rotationPeriod = parseInt(properties.rotation_period);
    this.orbitalPeriod = parseFloat(properties.orbital_period);
    this.diameter = parseFloat(properties.diameter);
    this.climate = toClimates(properties.climate);
    this.gravity = properties.gravity;
    this.terrain = properties.terrain.split(',').map((t) => t.trim());
    this.surfaceWater = parseFloat(properties.surface_water);
    this.population = parseInt(properties.population);
    this.residentKeys = properties.residents;
    this.filmKeys = properties.films;
    this.cacheKeyName = 'planets';
  }

  static cacheKeyName(): string {
    return 'planets';
  }

  residents(): Person[] {
    return this.findRelation(this.residentKeys, Person);
  }

  residentIds(): number[] {
    return this.residentKeys.map((k) => this.parseIdentifier(k));
  }

  films(): Film[] {
    return this.findRelation(this.filmKeys, Film);
  }

  filmIds(): number[] {
    return this.filmKeys.map((k) => this.parseIdentifier(k));
  }
}