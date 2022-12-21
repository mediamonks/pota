import { parseCliTemplateParams } from './parseCliTemplateParams.js';

describe('parseCliTemplateParams', () => {
  it('parses a string parameter', () => {
    const result = parseCliTemplateParams('key=value');
    expect(result).toEqual([{ key: 'value' }]);
  });

  it('returns the original string parameter if it does not contain an equals sign', () => {
    const result = parseCliTemplateParams('param');
    expect(result).toEqual(['param']);
  });

  it('returns an array of strings when all params are strings', () => {
    const result = parseCliTemplateParams(['param1', 'param2']);
    expect(result).toEqual(['param1', 'param2']);
  });

  it('returns an array of objects when params contain "=" character', () => {
    const result = parseCliTemplateParams(['key1=value1', 'key2=value2']);
    expect(result).toEqual([{ key1: 'value1' }, { key2: 'value2' }]);
  });

  it('returns a mixed array of strings and objects', () => {
    const result = parseCliTemplateParams(['param1', 'key1=value1', 'param2']);
    expect(result).toEqual(['param1', { key1: 'value1' }, 'param2']);
  });
});
