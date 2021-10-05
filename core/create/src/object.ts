export function getPathToValue(value: unknown, object: {}): ReadonlyArray<string> | null {
  type Key = keyof typeof object;

  for (const key of Object.keys(object || {})) {
    const fValue = object![key as Key];

    if (fValue === value) return [key];
    if (typeof fValue === "string") continue;

    const path = getPathToValue(value, fValue);

    if (path && path.length > 0) return [key, ...path];
  }

  return null;
}

export function getValueForPath(path: ReadonlyArray<string>, object: {}) {
  let current = object;

  type Key = keyof typeof current;

  for (const key of path) {
    if (key in current) current = current[key as Key];
    else return null;
  }

  return current;
}

export function setValueForPath(value: unknown, path: ReadonlyArray<string>, object: {}) {
  let current = object;

  type Current = typeof current;
  type Key = keyof Current;

  const lastKey = path[path.length - 1];

  for (const key of path) {
    // set the value if the key is last one in the path
    if (lastKey === key) {
      (current[key as Key] as Current) = value as Current;
      return;
    }

    // go to next key
    current = current[key as Key] ?? {};
  }
}
