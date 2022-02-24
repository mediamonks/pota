import { exec } from 'child_process';
import type { SpawnOptions } from 'child_process';

import crossSpawn from 'cross-spawn';

function createSpawn(options: SpawnOptions) {
  return (command: string, ...args: string[]): Promise<void> =>
    new Promise<void>((resolve, reject) =>
      crossSpawn(command, args, options)
        .on('close', (code) =>
          code !== 0 ? reject({ command: `${command} ${args.join(' ')}` }) : resolve(),
        )
        .on('error', reject),
    );
}

export const spawn = createSpawn({ stdio: 'inherit' });

export function command(command: string, quiet: boolean = true) {
  return new Promise<string | undefined>((resolve, reject) =>
    exec(command, (error, stdout, stderr) => {
      if (error) return reject(error);
      resolve(quiet ? undefined : stdout || stderr);
    }),
  );
}
