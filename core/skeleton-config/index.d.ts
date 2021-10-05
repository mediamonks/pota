export interface SkeletonConfig {
  /**
   * The files that should be excluded from the synchronizing to the project.
   * By default all files are included.
   */
  excludedFiles?: ReadonlyArray<string>;
  /**
   * The files that need their name or their source to be transformed in some manner,
   * before being synchronized to the project.
   */
  transformFiles?: Record<
    string,
    { newName?: string; transformSource?: (source: string) => string }
  >;
}
