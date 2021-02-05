import type { AVAILABLE_SKELETONS, AVAILABLE_TOOLS } from "./config";
import type { createSkeletonDependency, createToolDependency } from "./config";

export interface PorterModule {
  syncFiles?: (projectPath: string) => void;
  syncDependencies?: (projectPath: string) => void;
  decorate?: (command: string, meta: { name: string }) => void;
}

export interface PackageJSONShape {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export type SkeletonType = typeof AVAILABLE_SKELETONS[number];
export type SkeletonTool = typeof AVAILABLE_TOOLS[number];

export type PorterDependency =
  | ReturnType<typeof createToolDependency>
  | ReturnType<typeof createSkeletonDependency>;
