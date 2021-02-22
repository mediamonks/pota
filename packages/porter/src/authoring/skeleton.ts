type StringRecord = Record<string, string>;

export type PackageJsonShape = {
  scripts: StringRecord;
  dependencies: StringRecord;
  devDependencies?: StringRecord;
  files: string[];
};

type AllDependencies<P extends PackageJsonShape> =
  | keyof P["dependencies"]
  | keyof P["devDependencies"];

export interface PorterSkeletonInterface<P extends PackageJsonShape> {
  /**
   * The porter tool that should be used for the scripts.
   */
  tool: string;
  /**
   * The dependencies that should be synchronized to the project's `dependencies`.
   */
  dependencies: ReadonlyArray<AllDependencies<P>>;
  /**
   * The dependencies that should be synchronized to the project's `devDependencies`.
   */
  devDependencies: ReadonlyArray<AllDependencies<P>>;
  /**
   * The scripts that should be synchronized to the project's `scripts`.
   */
  scripts: ReadonlyArray<keyof P["scripts"]>;
  /**
   * The scripts of the base tool related to the skeleton,
   * that should be synchronized to the project's `scripts`.
   */
  toolScripts: ReadonlyArray<string>;
  /**
   * The files that should be excluded from the synchronizing to the project.
   * By default all files are included.
   */
  excludedFiles: ReadonlyArray<P["files"][number]>;
  /**
   * The files that need their name or their source to be transformed in some manner,
   * before being synchronized to the project.
   */
  transformFiles: Record<string, { name?: string; source?: (source: string) => string }>;
}

export abstract class PorterSkeleton<P extends PackageJsonShape>
  implements PorterSkeletonInterface<P> {
  /**
   * The porter tool that should be used for the scripts.
   */
  public abstract tool: string;
  /**
   * The dependencies that should be synchronized to the project's `dependencies`.
   */
  public abstract dependencies: ReadonlyArray<AllDependencies<P>>;
  /**
   * The dependencies that should be synchronized to the project's `devDependencies`.
   */
  public abstract devDependencies: ReadonlyArray<AllDependencies<P>>;
  /**
   * The scripts that should be synchronized to the project's `scripts`.
   */
  public abstract scripts: ReadonlyArray<keyof P["scripts"]>;
  /**
   * The scripts of the base tool related to the skeleton,
   * that should be synchronized to the project's `scripts`.
   */
  public abstract toolScripts: ReadonlyArray<string>;
  /**
   * The files that should be excluded from the synchronizing to the project.
   * By default all files are included.
   */
  public abstract excludedFiles: ReadonlyArray<P["files"][number]>;
  /**
   * The files that need their name or their source to be transformed in some manner,
   * before being synchronized to the project.
   */
  public abstract transformFiles: Record<
    string,
    { name?: string; source?: (source: string) => string }
  >;
}
