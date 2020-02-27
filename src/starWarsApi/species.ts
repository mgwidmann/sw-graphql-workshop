import { Base, Color, Language, toLanguage, toColors } from './base';
import { Person } from './person';
import { Film } from './film';

export enum Classification {
  mammal,
  mammals,
  amphibian,
  reptile,
  insectoid,
  artificial,
  gastropod,
  sentient // This looks like a mistake in the data
}

export function toClassification(c: string): Classification {
  let classification = c == 'unknown' ? undefined : Classification[c as keyof typeof Classification];
  if (!classification) { throw `Unknown Classification: '${c}'` };
  return classification;
}

export enum Designation {
  sentient,
  reptilian // This looks like a mistake in the data
}

export function toDesignation(d: string): Designation {
  let designation = d == 'unknown' ? undefined : Designation[d as keyof typeof Designation];
  if (!designation) { throw `Unknown Designation: '${d}'` };
  return designation;
}

interface SpeciesProperties {
  name: string
  classification: string
  designation: string
  average_height: string
  skin_colors: string
  hair_colors: string
  eye_colors: string
  average_lifespan: string
  homeworld: string
  language: string
  people: string[]
  films: string[]
  url: string
}

export class Species extends Base {
  id: number
  name: string
  classification?: Classification
  designation: Designation
  averageHeight?: number
  skinColors: Color[]
  hairColors: Color[]
  eyeColors: Color[]
  averageLifespan?: number
  language?: Language
  homeworldKey: string
  peopleKeys: string[]
  filmKeys: string[]

  constructor(properties: SpeciesProperties) {
    super({});
    this.id = this.parseIdentifier(properties.url);
    this.name = properties.name;
    this.classification = properties.classification == 'unknown' ? undefined : Classification[properties.classification as keyof typeof Classification];
    this.designation = Designation[properties.designation as keyof typeof Designation];
    this.averageHeight = properties.average_height == 'unknown' ? undefined : parseInt(properties.average_height);
    this.skinColors = toColors(properties.skin_colors);
    this.hairColors = toColors(properties.hair_colors);
    this.eyeColors = toColors(properties.eye_colors);
    this.averageLifespan = properties.average_lifespan == 'unknown' ? undefined : parseInt(properties.average_lifespan);
    this.language = toLanguage(properties.language);
    this.homeworldKey = properties.homeworld;
    this.peopleKeys = properties.people;
    this.filmKeys = properties.films;
  }

  static cacheKeyName(): string {
    return 'species';
  }

  people(): Person[] {
    return this.findRelation(this.peopleKeys, Person);
  }

  peopleIds(): number[] {
    return this.peopleKeys.map((k) => this.parseIdentifier(k));
  }

  films(): Film[] {
    return this.findRelation(this.filmKeys, Film);
  }

  filmIds(): number[] {
    return this.filmKeys.map((k) => this.parseIdentifier(k));
  }
}