import { getCommandModules } from "./commands.js";
import { getSkeleton } from "./skeleton.js";

// TODO: top level await
(async () => {
  const skeleton = await getSkeleton();

  if (!skeleton) {
    console.log("Error: no skeleton is defined in the `POTA_SKELETON` environment variable or in the pota configuration in 'pacakge.json'");
    process.exit(1);
  }

  const [sade, commandModules] = await Promise.all([import("sade").then(({ default: m }) => m), getCommandModules(skeleton)]);

  const program = sade("pota");

  for (const commandModule of commandModules) {
    const { command = () => { } } = await import(commandModule) ?? {};

    await command(program);
  }

  program.parse(process.argv);

})();

