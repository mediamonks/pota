import { options as webpackSkeletonOptions } from "@pota/webpack-skeleton/pota/commands/build.js"

export { description, action } from "@pota/webpack-skeleton/pota/commands/build.js"

export const options = [
  ...webpackSkeletonOptions,
  {
    option: '--profile',
    description: 'The public url',
  },
];

