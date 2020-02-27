import { Base, Color, toColors, toYear, SWYear } from './base';
import { World } from './world';
import { Film } from './film';
import { Species } from './species';
import { Vehicle } from './vehicle';
import { Starship } from './starship';

interface PersonProperties {
  name: string
  height: string
  mass: string
  hair_color: string
  skin_color: string
  eye_color: string
  birth_year: string
  gender: string
  homeworld: string
  films: string[]
  species: string[]
  vehicles: string[]
  starships: string[]
  url: string
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Hermaphrodite = 'hermaphrodite',
  None = 'none',
  NotAvailable = 'n/a',
}

export function toGender(gender: string): Gender {
  let value = Object.values(Gender).includes(gender.trim() as Gender) ? gender.trim() as Gender : undefined;
  if (!value) { throw `Unknown Gender: '${gender}'` }
  return value;
}

export class Person extends Base {
  id: number
  name: string
  height: number
  mass: number
  hairColor: Color
  skinColor: Color
  eyeColor: Color
  birthYear: SWYear
  gender: Gender
  homeworldKey: string
  filmKeys: string[]
  speciesKeys: string[]
  vehicleKeys: string[]
  starshipKeys: string[]

  constructor(properties: PersonProperties) {
    super({});
    this.id = this.parseIdentifier(properties.url);
    this.name = properties.name;
    this.height = parseFloat(properties.height);
    this.mass = parseFloat(properties.mass);
    this.hairColor = toColors(properties.hair_color)[0];
    this.skinColor = toColors(properties.skin_color)[0];
    this.eyeColor = toColors(properties.eye_color)[0];
    this.birthYear = toYear(properties.birth_year);
    this.gender = toGender(properties.gender);
    this.homeworldKey = properties.homeworld;
    this.filmKeys = properties.films;
    this.speciesKeys = properties.species;
    this.vehicleKeys = properties.vehicles;
    this.starshipKeys = properties.starships;
  }

  static cacheKeyName(): string {
    return 'people';
  }

  homeworld(): World {
    return this.findRelation<World>([this.homeworldKey], World)[0];
  }

  films(): Film[] {
    return this.findRelation(this.filmKeys, Film);
  }

  filmIds(): number[] {
    return this.filmKeys.map((k) => this.parseIdentifier(k));
  }

  species(): Species[] {
    return this.findRelation(this.speciesKeys, Species);
  }

  speciesIds(): number[] {
    return this.speciesKeys.map((k) => this.parseIdentifier(k));
  }

  vehicles(): Vehicle[] {
    return this.findRelation(this.vehicleKeys, Vehicle);
  }

  vehicleIds(): number[] {
    return this.vehicleKeys.map((k) => this.parseIdentifier(k));
  }

  starships(): Starship[] {
    return this.findRelation(this.starshipKeys, Starship);
  }

  starshipIds(): number[] {
    return this.starshipKeys.map((k) => this.parseIdentifier(k));
  }
}