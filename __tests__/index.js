import m from '../';

jest.mock('fs');

describe('os-apps', () => {
  it('should get apps in directories', async () => {
    // eslint-disable-next-line global-require, no-underscore-dangle
    require('fs').__setDirectoryFiles([
      'foo.app',
    ]);
    const dirs = [
      'foo',
    ];
    const apps = await m.getAppsInDirectories(dirs);
    expect(apps.length).toBe(1);
    expect(apps).toContain('foo/foo.app');
  });
});

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
      'NotAnApp',
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

describe('os-apps (win32)', () => {
  beforeAll(() => {
    // mocks the platform
    Object.defineProperty(process, 'platform', {
      value: 'win32',
    });
    Object.defineProperty(process.env, 'ProgramFiles', {
      value: 'C:\\Program Files',
    });
    Object.defineProperty(process.env, 'ProgramFiles(x86)', {
      value: 'C:\\rogram Files (x86)',
    });
  });
  it('should retrieve windows system apps', async () => {
    // eslint-disable-next-line global-require, no-underscore-dangle
    require('fs').__setDirectoryFiles([
      'Chrome.exe',
      'Firefox.exe',
      'MSIE.exe',
    ]);
    const apps = await m.getAll();
    expect(apps.length).toBe(6);
    expect(apps).toContain('C:\\Program Files/Chrome.exe');
    expect(apps).not.toContain('C:\\Progrm Files/Safari.exe');
  });
});
