import m from '../';

jest.mock('fs');

describe('os-apps (darwin)', () => {
  beforeAll(() => {
    // mocks the platform
    Object.defineProperty(process, 'platform', {
      value: 'darwin',
    });
  });
  process.platform = 'darwin';
  it('should retrieve mac system apps', async () => {
    // eslint-disable-next-line global-require, no-underscore-dangle
    require('fs').__setDirectoryFiles([
      'Safari.app',
      'Chrome.app',
      'Firefox.app',
    ]);
    const apps = await m.getAll();
    expect(apps.length).toBe(3);
    expect(apps).toContain('/Applications/Safari.app');
    expect(apps).toContain('/Applications/Chrome.app');
    expect(apps).toContain('/Applications/Firefox.app');
    expect(apps).not.toContain('/Applications/MSIE.app');
  });
});

describe('os-apps (linux)', () => {
  beforeAll(() => {
    // mocks the platform
    Object.defineProperty(process, 'platform', {
      value: 'linux',
    });
  });
  it('should retrieve linux system apps', async () => {
    // eslint-disable-next-line global-require, no-underscore-dangle
    require('fs').__setDirectoryFiles([
      'Chrome.desktop',
      'Firefox.desktop',
    ]);
    const apps = await m.getAll();
    expect(apps.length).toBe(2);
    expect(apps).toContain('/usr/share/Chrome.desktop');
    expect(apps).toContain('/usr/share/Firefox.desktop');
    expect(apps).not.toContain('/usr/share/Safari.desktop');
  });
});
