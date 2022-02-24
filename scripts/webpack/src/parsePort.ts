export async function parsePort(port?: number) {
  const { default: getPort, portNumbers } = await import('get-port');

  return getPort(port ? { port: portNumbers(port, port + 100) } : undefined);
}
