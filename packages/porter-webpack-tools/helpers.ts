export type Arguments<T extends Record<string, { default: unknown }>> = {
  [K in keyof T]: T[K]["default"];
};
