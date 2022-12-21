import { normalizeTemplateDirs } from './normalizeTemplateDirs.js';

describe('normalizeTemplateDirs', () => {
  it('should handle string config', () => {
    const config = 'path/to/templates';
    expect(normalizeTemplateDirs(config)).toEqual([['path/to/templates']]);
  });

  it('should handle object config', () => {
    const config = {
      namespace1: 'path/to/templates1',
      namespace2: 'path/to/templates2',
    };
    expect(normalizeTemplateDirs(config)).toEqual([
      ['path/to/templates1', 'namespace1'],
      ['path/to/templates2', 'namespace2'],
    ]);
  });

  it('should handle array config', () => {
    const config = [
      'path/to/templates1',
      { namespace1: 'path/to/templates2' },
      { namespace2: 'path/to/templates3' },
    ] as const;
    expect(normalizeTemplateDirs(config)).toEqual([
      ['path/to/templates1'],
      ['path/to/templates2', 'namespace1'],
      ['path/to/templates3', 'namespace2'],
    ]);
  });
});
