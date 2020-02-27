import { Person } from '../../src/starWarsApi/person';

describe('Person', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  it('List first page', () => {
    let page = Person.list<Person>();
    expect(page).toBeDefined();
    if (page != undefined) {
      expect(page.results.length).toBeGreaterThanOrEqual(1);
      let person = page.results[0];
      expect(person.name).toEqual('Luke Skywalker');
      expect(person.id).toEqual(1);
    }
  });

  it('List other pages', () => {
    for (let i of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      let page = Person.list(i);
      expect(page).toBeDefined();
      if (page != undefined) {
        expect(page.results.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('find', () => {
    let person = Person.find(1);
    expect(person).toBeDefined();
    if (person != undefined) {
      expect(person).toBeTruthy();
    }
  });

  it('homeworld', () => {
    let person = Person.find<Person>(1);
    expect(person).toBeDefined();
    if (person != undefined) {
      expect(person.homeworld()).toBeTruthy();
    }
  });

  it('films', () => {
    let person = Person.find<Person>(1);
    expect(person).toBeDefined();
    if (person != undefined) {
      expect(person.films().length).toBeGreaterThanOrEqual(1);
    }
  });

  it('species', () => {
    let person = Person.find<Person>(1);
    expect(person).toBeDefined();
    if (person != undefined) {
      expect(person.species().length).toBeGreaterThanOrEqual(1);
    }
  });

  it('vehicles', () => {
    let person = Person.find<Person>(1);
    expect(person).toBeDefined();
    if (person != undefined) {
      expect(person.vehicles().length).toBeGreaterThanOrEqual(1);
    }
  });

  it('starships', () => {
    let person = Person.find<Person>(1);
    expect(person).toBeDefined();
    if (person != undefined) {
      expect(person.starships().length).toBeGreaterThanOrEqual(1);
    }
  });
});