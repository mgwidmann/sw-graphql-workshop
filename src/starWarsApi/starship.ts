import { Base } from './base';
import { Person } from './person';
import { Film } from './film';

interface StarshipProperties {
  name: string
  model: string,
  manufacturer: string
  cost_in_credits: string
  length: string
  max_atmosphering_speed: string
  crew: string
  passengers: string
  cargo_capacity: string
  consumables: string
  hyperdrive_rating: string
  MGLT: string
  starship_class: string
  pilots: string[]
  films: string[]
  url: string
}

export enum ConsumableStorageUnit {
  Hour = 'hour',
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

export interface ConsumableStorage {
  value: number
  unit: ConsumableStorageUnit
}

export function toConsumableStorage(s: string): ConsumableStorage | undefined {
  let [value, unit] = s.split(' ');
  switch (unit) {
    case 'hour':
    case 'hours':
      return { value: parseFloat(value), unit: ConsumableStorageUnit.Hour };
    case 'day':
    case 'days':
      return { value: parseFloat(value), unit: ConsumableStorageUnit.Day };
    case 'week':
    case 'weeks':
      return { value: parseFloat(value), unit: ConsumableStorageUnit.Week };
    case 'month':
    case 'months':
      return { value: parseFloat(value), unit: ConsumableStorageUnit.Month };
    case 'year':
    case 'years':
      return { value: parseFloat(value), unit: ConsumableStorageUnit.Year };

    default:
      return undefined;
  }
}

export class Starship extends Base {
  name: string
  model: string
  manufacturer: string
  costInCredits: number
  length: number
  maxAtmospheringSpeed: number
  crew: number
  passengers: number
  cargoCapacity: number
  consumableStorage?: ConsumableStorage
  hyperdriveRating: number
  MGLT: number
  starshipClass: string
  pilotKeys: string[]
  filmKeys: string[]

  constructor(properties: StarshipProperties) {
    super({});
    this.id = this.parseIdentifier(properties.url);
    this.name = properties.name;
    this.model = properties.model;
    this.manufacturer = properties.manufacturer;
    this.costInCredits = parseInt(properties.cost_in_credits);
    this.length = parseInt(properties.length);
    this.maxAtmospheringSpeed = parseInt(properties.max_atmosphering_speed);
    this.crew = parseInt(properties.crew);
    this.passengers = parseInt(properties.passengers);
    this.cargoCapacity = parseInt(properties.cargo_capacity);
    this.consumableStorage = toConsumableStorage(properties.consumables);
    this.hyperdriveRating = parseInt(properties.hyperdrive_rating);
    this.MGLT = parseInt(properties.MGLT);
    this.starshipClass = properties.starship_class;
    this.pilotKeys = properties.pilots;
    this.filmKeys = properties.films;
    this.cacheKeyName = 'starships';
  }

  static cacheKeyName(): string {
    return 'starships';
  }

  pilots(): Person[] {
    return this.findRelation(this.pilotKeys, Person);
  }

  pilotIds(): number[] {
    return this.pilotKeys.map((k) => this.parseIdentifier(k));
  }

  films(): Film[] {
    return this.findRelation(this.filmKeys, Film);
  }

  filmIds(): number[] {
    return this.filmKeys.map((k) => this.parseIdentifier(k));
  }
}