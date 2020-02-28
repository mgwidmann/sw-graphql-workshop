import { Base } from './base';
import { Person } from './person';
import { World } from './world';
import { Starship } from './starship';
import { Vehicle } from './vehicle';
import { Species } from './species';
import { parse } from 'querystring';

interface FilmProperties {
  title: string
  episode_id: number
  opening_crawl: string
  director: string
  producer: string
  release_date: string
  characters: string[]
  planets: string[]
  starships: string[]
  vehicles: string[]
  species: string[]
  url: string
}

export class Film extends Base {
  title: string
  episodeId: number
  openingCrawl: string
  director: string
  producer: string
  releaseDate: Date
  characterKeys: string[]
  planetKeys: string[]
  starshipKeys: string[]
  vehicleKeys: string[]
  speciesKeys: string[]

  constructor(properties: FilmProperties) {
    super({});
    this.id = this.parseIdentifier(properties.url);
    this.title = properties.title;
    this.episodeId = properties.episode_id;
    this.openingCrawl = properties.opening_crawl;
    this.director = properties.director;
    this.producer = properties.producer;
    this.releaseDate = new Date(Date.parse(properties.release_date));
    this.characterKeys = properties.characters;
    this.planetKeys = properties.planets;
    this.starshipKeys = properties.starships;
    this.vehicleKeys = properties.vehicles;
    this.speciesKeys = properties.species;
    this.cacheKeyName = 'films';
  }

  static cacheKeyName(): string {
    return 'films';
  }

  characters(): Person[] {
    return this.findRelation(this.characterKeys, Person);
  }

  characterIds(): number[] {
    return this.characterKeys.map((k) => this.parseIdentifier(k));
  }

  planets(): World[] {
    return this.findRelation(this.planetKeys, World);
  }

  planetIds(): number[] {
    return this.planetKeys.map((k) => this.parseIdentifier(k));
  }

  starships(): Starship[] {
    return this.findRelation(this.starshipKeys, Starship);
  }

  starshipIds(): number[] {
    return this.starshipKeys.map((k) => this.parseIdentifier(k));
  }

  vehicles(): Vehicle[] {
    return this.findRelation(this.vehicleKeys, Vehicle);
  }

  vehicleIds(): number[] {
    return this.vehicleKeys.map((k) => this.parseIdentifier(k));
  }

  species(): Species[] {
    return this.findRelation(this.speciesKeys, Species);
  }

  speciesIds(): number[] {
    return this.speciesKeys.map((k) => this.parseIdentifier(k));
  }
}