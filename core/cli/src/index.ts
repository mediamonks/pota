import { basename, extname } from "path";

import type { CommandModule } from "./commands.js";
import { getCommandPaths } from "./commands.js";
import { getSkeletonName } from "./skeleton.js";

// TODO: top level await
(async () => {
  const mainSkeleton = await getSkeletonName();

  if (!mainSkeleton) {
    console.log("Error: no skeleton is defined in the `POTA_SKELETON` environment variable or in the pota configuration in 'pacakge.json'");
    process.exit(1);
  }

  const [sade, commandModules] = await Promise.all([import("sade").then(({ default: m }) => m), getCommandPaths(mainSkeleton)]);

  const program = sade("pota");

  for (const { skeleton, path } of commandModules) {
    const module: CommandModule = await import(path);
    if ("action" in module && typeof module.action === "function") {
      const { action, command, options, examples } = module;
      let { description } = module;

      const moduleProgram = program.command(command || basename(path, extname(path)));

      const skeletonString = `[${skeleton}]`;

      if (description) {
        if (typeof description === "string" && !description.endsWith(".")) description = `${description}.`;

        moduleProgram.describe(typeof description === "string" ? `${description} ${skeletonString}` : [...description, skeletonString])
      }
      if (options) {
        for (const o of options) moduleProgram.option(o.option, o.description, o.default);
      }
      if (examples) {
        for (const example of examples) moduleProgram.example(example);
      }

      moduleProgram.action(action);
    }

  }

  program.parse(process.argv);

})();

