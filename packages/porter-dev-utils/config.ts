import { SkeletonTool, SkeletonType } from "./types";

export const AVAILABLE_SKELETONS = ["react", "react-base", "vue"] as const;
export const AVAILABLE_TOOLS = ["react", "vue"] as const;

export const SKELETON_TOOL_MAP: Record<SkeletonType, SkeletonTool> = {
  react: "react",
  "react-base": "react",
  vue: "vue",
};

export const CLI_DEPENDENCY = "@mediamonks/porter" as const;
export const MISC_DEPENDENCIES = ["sort-package-json"] as const;

export const createSkeletonDependency = (type: SkeletonType) =>
  `@mediamonks/porter-${type}-skeleton` as const;

export const createToolDependency = (tool: SkeletonTool) =>
  `@mediamonks/porter-${tool}-tools` as const;
