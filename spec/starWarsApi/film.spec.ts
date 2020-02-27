import { Film } from '../../src/starWarsApi/film';

describe('Film', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  it('List first page', () => {
    let page = Film.list<Film>();
    expect(page).toBeDefined();
    if (page != undefined) {
      expect(page.results.length).toBeGreaterThanOrEqual(1);
      let film = page.results[0];
      expect(film.title).toEqual('A New Hope');
      expect(film.id).toEqual(1);
    }
  });

  it('no other pages', () => {
    expect(Film.list<Film>(2)).toBeNull();
  });

  it('find', () => {
    let film = Film.find<Film>(1);
    expect(film).toBeTruthy();
    if (film != undefined) {
      expect(film.id).toEqual(1);
    }
  });

  it('characters', () => {
    let film = Film.find<Film>(1);
    expect(film).toBeDefined();
    if (film != undefined) {
      expect(film.characters().length).toBeGreaterThanOrEqual(1);
    }
  });

  it('planets', () => {
    let film = Film.find<Film>(1);
    expect(film).toBeDefined();
    if (film != undefined) {
      expect(film.planets().length).toBeGreaterThanOrEqual(1);
    }
  });

  it('species', () => {
    let film = Film.find<Film>(1);
    expect(film).toBeDefined();
    if (film != undefined) {
      expect(film.species().length).toBeGreaterThanOrEqual(1);
    }
  });

  it('vehicles', () => {
    let film = Film.find<Film>(1);
    expect(film).toBeDefined();
    if (film != undefined) {
      expect(film.vehicles().length).toBeGreaterThanOrEqual(1);
    }
  });

  it('starships', () => {
    let film = Film.find<Film>(1);
    expect(film).toBeDefined();
    if (film != undefined) {
      expect(film.starships().length).toBeGreaterThanOrEqual(1);
    }
  });
});