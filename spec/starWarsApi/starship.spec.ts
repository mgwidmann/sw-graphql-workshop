import { Starship } from '../../src/starWarsApi/starship';

describe('Starship', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  it('List first page', () => {
    let page = Starship.list<Starship>();
    expect(page).toBeDefined();
    if (page != undefined) {
      expect(page.results.length).toBeGreaterThanOrEqual(1);
      let starship = page.results[0];
      expect(starship.name).toEqual('Executor');
      expect(starship.id).toEqual(15);
    }
  });

  it('List other pages', () => {
    for (let i of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      let page = Starship.list(i);
      expect(page).toBeDefined();
      if (page != undefined) {
        expect(page.results.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('find', () => {
    let starship = Starship.find(2);
    expect(starship).toBeTruthy();
  });

  it('update', () => {
    let starship = Starship.find<Starship>(20);
    expect(starship).toBeDefined();
    if (starship != undefined) {
      starship.update({ name: "Updated name" });

      let starship2 = Starship.find<Starship>(20);
      expect(starship2).toBeDefined();
      if (starship2 != undefined) {
        expect(starship2.name).toEqual("Updated name");
      }
    }
  });


  it('pilots', () => {
    let starship = Starship.find<Starship>(12);
    expect(starship).toBeDefined();
    if (starship != undefined) {
      expect(starship.pilots().length).toBeGreaterThanOrEqual(1);
    }
  });

  it('films', () => {
    let starship = Starship.find<Starship>(2);
    expect(starship).toBeDefined();
    if (starship != undefined) {
      expect(starship.films().length).toBeGreaterThanOrEqual(1);
    }
  });
});