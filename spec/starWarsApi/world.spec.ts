import { World } from '../../src/starWarsApi/world';

describe('World', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  it('List first page', () => {
    let page = World.list<World>();
    expect(page).toBeDefined();
    if (page != undefined) {
      expect(page.results.length).toBeGreaterThanOrEqual(1);
      let world = page.results[0];
      // expect(world.name).toEqual('Luke Skywalker');
      // expect(world.id).toEqual(1);
    }
  });

  it('List other pages', () => {
    for (let i of [1, 2, 3, 4]) {
      let page = World.list(i);
      expect(page).toBeDefined();
      if (page != undefined) {
        expect(page.results.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('find', () => {
    let world = World.find(1);
    expect(world).toBeTruthy();
  });

  it('residents', () => {
    let world = World.find<World>(1);
    expect(world).toBeDefined();
    if (world != undefined) {
      expect(world.residents().length).toBeGreaterThanOrEqual(1);
    }
  });

  it('films', () => {
    let world = World.find<World>(1);
    expect(world).toBeDefined();
    if (world != undefined) {
      expect(world.films().length).toBeGreaterThanOrEqual(1);
    }
  });
});