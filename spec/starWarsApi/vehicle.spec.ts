import { Vehicle } from '../../src/starWarsApi/vehicle';

describe('Vehicle', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  it('List first page', () => {
    let page = Vehicle.list<Vehicle>();
    expect(page).toBeDefined();
    if (page != undefined) {
      expect(page.results.length).toBeGreaterThanOrEqual(1);
      let vehicle = page.results[0];
      expect(vehicle.name).toEqual('Sand Crawler');
      expect(vehicle.id).toEqual(4);
    }
  });

  it('List other pages', () => {
    for (let i of [1, 2, 3, 4]) {
      let page = Vehicle.list(i);
      expect(page).toBeDefined();
      if (page != undefined) {
        expect(page.results.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('find', () => {
    let vehicle = Vehicle.find(4);
    expect(vehicle).toBeTruthy();
  });

  it('pilots', () => {
    let vehicle = Vehicle.find<Vehicle>(14);
    expect(vehicle).toBeDefined();
    if (vehicle != undefined) {
      expect(vehicle.pilots().length).toBeGreaterThanOrEqual(1);
    }
  });

  it('films', () => {
    let vehicle = Vehicle.find<Vehicle>(4);
    expect(vehicle).toBeDefined();
    if (vehicle != undefined) {
      expect(vehicle.films().length).toBeGreaterThanOrEqual(1);
    }
  });
});