import { Species } from '../../src/starWarsApi/species';

describe('Species', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  it('List first page', () => {
    let page = Species.list();
    expect(page).toBeDefined();
    if (page != undefined) {
      expect(page.results.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('List other pages', () => {
    for (let i of [1, 2, 3, 4]) {
      let page = Species.list(i);
      expect(page).toBeDefined();
      if (page != undefined) {
        expect(page.results.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('find', () => {
    expect(Species.find(1)).toBeTruthy();
  });

  it('update', () => {
    let species = Species.find<Species>(20);
    expect(species).toBeDefined();
    if (species != undefined) {
      species.update({ name: "Updated name" });

      let species2 = Species.find<Species>(20);
      expect(species2).toBeDefined();
      if (species2 != undefined) {
        expect(species2.name).toEqual("Updated name");
      }
    }
  });

  it('people', () => {
    let species = Species.find<Species>(1);
    expect(species).toBeDefined();
    if (species != undefined) {
      expect(species.people().length).toBeGreaterThanOrEqual(1);
    }
  });

  it('films', () => {
    let species = Species.find<Species>(1);
    expect(species).toBeDefined();
    if (species != undefined) {
      expect(species.films().length).toBeGreaterThanOrEqual(1);
    }
  });
});