import sade from 'sade';

import { getCommandModules } from './commands.js';
import { getSkeletonName } from './skeleton.js';

// TODO: top level await
(async () => {
  const mainSkeleton = await getSkeletonName();

  if (!mainSkeleton) {
    throw new Error(
      "no skeleton is defined in the `POTA_SKELETON` environment variable or in the pota configuration in 'package.json'",
    );
  }

  const main = sade('pota');

  for (const module of await getCommandModules(mainSkeleton)) {
    const { action, command, options, examples, description, skeleton } = module;

    if (!action || typeof action !== "function") continue;

    const program = main.command(command);

    const skeletonString = `[${skeleton}]`;

    program.describe(
      description
        ? typeof description === 'string'
          ? `${description} ${skeletonString}`
          : [...description, skeletonString]
        : skeletonString,
    );

    if (options) {
      for (const o of options) program.option(o.option, o.description, o.default);
    }
    if (examples) {
      for (const example of examples) program.example(example);
    }

    program.action(action);
  }

  main.parse(process.argv);
})();
