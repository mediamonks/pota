import * as fs from "fs-extra";
import * as path from "path";
import { PackageJsonShape, PorterSkeletonInterface } from "../authoring/skeleton";
import { getToolFromDependency } from "../config";

export function withSynchronizers<T extends { new (): PorterSkeletonInterface<any> }>(skeleton: T) {
  // @ts-expect-error TS is drunk again "A mixin class must have a constructor with a single rest parameter of type 'any[]'" https://github.com/microsoft/TypeScript/issues/37142
  return class extends skeleton {
    public constructor(public readonly projectPath: string, public readonly skeletonPath: string) {
      super();
    }

    get allExcludedFiles() {
      return [
        ...this.excludedFiles,
        "node_modules",
        "package.json",
        "porter.ts",
        "tsconfig.tools.json",
      ];
    }

    /**
     * Will synchronize the skeleton files to the project.
     * @param projectPath - the path of the created project
     * @param skeletonPath - the path of the skeleton package in the created project
     */
    // @ts-ignore
    public synchronizeFiles() {
      const files = fs
        .readdirSync(this.skeletonPath)
        .map((filePath) => path.basename(filePath))
        .filter((file) => !this.allExcludedFiles.includes(file));

      for (const file of files) {
        const filePath = path.join(this.skeletonPath, file);

        // ensure the skeleton file exists
        if (!fs.existsSync(filePath)) {
          console.log(`'${filePath}' doesn't exist`);
          continue;
        }

        if (file in this.transformFiles) {
          const transformer = this.transformFiles[file];

          const source = fs.readFileSync(filePath, { encoding: "utf-8" });

          // write (copy) from skeleton to new project
          fs.writeFileSync(
            path.join(
              this.projectPath,
              // transform file name
              transformer.name ?? file
            ),
            // transform file source
            transformer.source?.(source) ?? source
          );
        } else {
          // copy from skeleton to new project
          fs.copySync(filePath, path.join(this.projectPath, file));
        }
      }

      return this;
    }

    get projectPackagePath() {
      return path.join(this.projectPath, "package.json");
    }

    /**
     * Will synchronize the skeleton dependencies to the project.
     * @param projectPath - the path of the created project
     * @param skeletonPath - the path of the skeleton package in the created project
     */
    // @ts-ignore
    public synchronizeDependencies() {
      const skeletonPackage = require(path.join(
        this.skeletonPath,
        "package.json"
      )) as PackageJsonShape;

      const projectPackage = fs.readJsonSync(this.projectPackagePath) as PackageJsonShape;

      const dependencies = this.dependencies
        .map(
          (dependency) => [dependency, skeletonPackage.dependencies[dependency as string]] as const
        )
        .filter(([name, version]) => name && version);

      const devDependencies = this.dependencies
        .map(
          (dependency) =>
            [dependency, skeletonPackage.devDependencies?.[dependency as string]] as const
        )
        .filter(([name, version]) => name && version);

      fs.writeJSONSync(this.projectPackagePath, {
        ...projectPackage,
        ...(dependencies.length > 0 && {
          dependencies: { ...projectPackage.dependencies, ...Object.fromEntries(dependencies) },
        }),
        ...(devDependencies.length > 0 && {
          devDependencies: {
            ...projectPackage.devDependencies,
            ...Object.fromEntries(devDependencies),
          },
        }),
      });

      return this;
    }

    /**
     * Will synchronize the skeleton scripts to the project.
     * @param projectPath - the path of the created project
     * @param skeletonPath - the path of the skeleton package in the created project
     */
    // @ts-ignore
    public synchronizeScripts() {
      const skeletonPackage = require(path.join(
        this.skeletonPath,
        "package.json"
      )) as PackageJsonShape;

      const projectPackage = fs.readJsonSync(this.projectPackagePath) as PackageJsonShape;

      const scripts = [
        ...this.toolScripts.map(
          (event) => [event, `porter ${getToolFromDependency(this.tool)} ${event}`] as const
        ),
        ...this.scripts
          .map((event) => [event, skeletonPackage.scripts[event as string]] as const)
          .filter(([event, command]) => event && command),
      ];

      fs.writeJSONSync(this.projectPackagePath, {
        ...projectPackage,
        scripts: { ...projectPackage.scripts, ...Object.fromEntries(scripts) },
      });

      return this;
    }
  };
}
