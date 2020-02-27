import { Base } from './base';
import { Person } from './person';
import { ConsumableStorage, toConsumableStorage } from './starship';
import { Film } from './film';

export interface VehicleProperties {
  name: string
  model: string
  manufacturer: string
  cost_in_credits: string
  length: string
  max_atmosphering_speed: string
  crew: string
  passengers: string
  cargo_capacity: string
  consumables: string
  vehicle_class: string
  pilots: string[]
  films: string[]
  url: string
}

export class Vehicle extends Base {
  id: number
  name: string
  model: string
  manufacturer: string
  costInCredits: number
  length: number
  maxAtmospheringSpeed: number
  crew: number
  passengers: number
  cargoCapacity: number
  consumables?: ConsumableStorage
  vehicleClass: string
  pilotKeys: string[]
  filmKeys: string[]

  constructor(properties: VehicleProperties) {
    super({});
    this.id = this.parseIdentifier(properties.url);
    this.name = properties.name;
    this.model = properties.model;
    this.manufacturer = properties.manufacturer;
    this.costInCredits = parseInt(properties.cost_in_credits);
    this.length = parseFloat(properties.length);
    this.maxAtmospheringSpeed = parseInt(properties.max_atmosphering_speed);
    this.crew = parseInt(properties.crew);
    this.passengers = parseInt(properties.passengers);
    this.cargoCapacity = parseInt(properties.cargo_capacity);
    this.consumables = toConsumableStorage(properties.consumables);
    this.vehicleClass = properties.vehicle_class;
    this.pilotKeys = properties.pilots;
    this.filmKeys = properties.films;
  }

  static cacheKeyName(): string {
    return 'vehicles';
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