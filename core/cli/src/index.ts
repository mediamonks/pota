import sade from "sade";

import { getCommandModules } from "./commands.js";
import { getSkeletonName } from "./skeleton.js";

// TODO: top level await
(async () => {
  const mainSkeleton = await getSkeletonName();

  if (!mainSkeleton) {
    console.log(
      "Error: no skeleton is defined in the `POTA_SKELETON` environment variable or in the pota configuration in 'pacakge.json'"
    );
    process.exit(1);
  }

  const main = sade("pota");

  for (const module of await getCommandModules(mainSkeleton)) {

    const { action, command, options, examples, description, skeleton } = module;

    const program = main.command(command);

    if (description) {
      const skeletonString = `[${skeleton}]`;

      program.describe(
        typeof description === "string"
          ? `${description} ${skeletonString}`
          : [...description, skeletonString]
      );
    }
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
