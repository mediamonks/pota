import { resolveUser } from "@mediamonks/porter-dev-utils/fs";
import { createPorterDependencyMatcher } from "@mediamonks/porter-dev-utils/misc";
import { PackageJSONShape, PorterModule, SkeletonTool } from "@mediamonks/porter-dev-utils/types";
import kleur from "kleur";

type NamedPorterModule = { name: string } & PorterModule;

async function getPorterModules(
  skeletonType: SkeletonTool,
  packageJsonPath: string
): Promise<NamedPorterModule[]> {
  const packageJson = (await import(packageJsonPath)) as PackageJSONShape;

  return Promise.all(
    Object.keys({ ...packageJson.dependencies, ...packageJson.devDependencies })
      .filter(createPorterDependencyMatcher(skeletonType))
      .map((dependency) =>
        import(`${dependency}/porter.ts`)
          .then((module) => ({ ...module, name: dependency }))
          .catch(() => {
            console.log(
              `${kleur.cyan(`[${dependency}]`)} could not find ${kleur.yellow(`'porter.ts'`)}`
            );
            return { name: dependency };
          })
      )
  );
}

export async function applyModules(skeletonType: SkeletonTool, subCommand: string) {
  const modules = await getPorterModules(skeletonType, resolveUser("package.json")).catch(
    (error) => {
      console.log("An error occurred in retrieving the package.json");
      console.error(error);
      return [];
    }
  );

  for (const { name, decorate } of modules) {
    if (decorate) {
      console.log(`${kleur.cyan(`[${name}]`)} decorating`);
      try {
        // decorate `program` with additional commands provided by the module
        decorate(subCommand, { name });
      } catch (error) {
        console.log(`${kleur.cyan(`[${name}]`)} decorator threw an error`);
        console.error(error);
      }
    }
  }
}
