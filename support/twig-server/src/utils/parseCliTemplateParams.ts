/**
 * Splits template params that contain an '=' character (like namespace=path) into an array pair.
 * @param params
 */
export function parseCliTemplateParams(
  params: string | Array<string>,
): Array<string | Record<string, string>> {
  const parseParam = (param: string) => {
    const [key, value] = param.split('=');
    return key && value ? { [key]: value } : param;
  };
  if (typeof params === 'string') {
    return [parseParam(params)];
  }
  return params.map((param) => parseParam(param));
}
