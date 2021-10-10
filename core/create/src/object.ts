export function merge(a: {}, b: {}) {
  // TODO: yes, I am ashamed of all of this 💔...
  type A = typeof a;
  type B = typeof b;

  type BKey = keyof B;

  const o: A & B = { ...a };

  type OKey = keyof typeof o;

  for (const key in b) {
    if (
      typeof o?.[key as OKey] === "object" &&
      typeof b?.[key as BKey] === "object" &&
      !Array.isArray(o[key as OKey]) &&
      !Array.isArray(b[key as BKey]) &&
      Object.keys(o[key as OKey] ?? {}).length > 0 &&
      Object.keys(b[key as BKey] ?? {}).length > 0) {
      const value = merge(o[key as OKey] as {}, b[key as BKey] as {});
      (o as any)[key as OKey] = value;
      continue;
    }
    o[key as OKey] = b[key as BKey];
  }

  return o;
}

