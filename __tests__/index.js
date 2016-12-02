import m from '../';

describe('os-apps', () => {
  it('should retrieve system apps', async () => {
    const apps = await m.getAll();
    expect(apps.length).toBeGreaterThan(0);
  });
});
