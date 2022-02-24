export async function createLogger() {
  const logSymbols = (await import('log-symbols')).default;
  // @ts-ignore, TS is being drunk again
  const kleur = (await import('kleur')).default;

  function log(...params: ReadonlyArray<unknown>) {
    console.log(...params);
  }

  return Object.assign(log, {
    color: kleur,
    info(...params: ReadonlyArray<unknown>) {
      console.info(logSymbols.info, ...params);
    },
    warn(...params: ReadonlyArray<unknown>) {
      console.info(logSymbols.warning, ...params);
    },
    error(...params: ReadonlyArray<unknown>) {
      console.info(logSymbols.error, ...params);
    },
  });
}
