import { typedObjectEntries } from "@psimk/typed-object";

const SCOPE = "@mediamonks";

export const CLI_DEPENDENCY = `${SCOPE}/porter` as const;

const getPorterDependency = <T extends string>(name: T) => `${SCOPE}/porter-${name}` as const;

export const SKELETON_SHORTHANDS = {
  [getPorterDependency("react-skeleton")]: ["react", "react-skeleton"],
  [getPorterDependency("react-base")]: ["react-base", "react-base-skeleton"],
  [getPorterDependency("vue-skeleton")]: ["vue", "vue-skeleton"],
};

export const INVERTED_SKELETON_SHORTHANDS = Object.fromEntries(
  typedObjectEntries(SKELETON_SHORTHANDS).flatMap(([skeleton, shorthands]) =>
    shorthands.map((shorthand) => [shorthand, skeleton] as const)
  )
);

export const getToolFromDependency = (dependency: string) =>
  /porter-([a-z]+)-tools/.exec(dependency)?.[1] ?? null;

export const MISC_DEPENDENCIES = ["sort-package-json"] as const;
