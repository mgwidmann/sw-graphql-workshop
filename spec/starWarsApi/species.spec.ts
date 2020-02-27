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