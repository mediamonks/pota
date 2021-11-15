import { options as webpackSkeletonOptions } from "@pota/webpack-skeleton/pota/commands/build.js"

export { description, action } from "@pota/webpack-skeleton/pota/commands/build.js"

import commonOptions from "../internal/commonOptions.js"

export const options = [...webpackSkeletonOptions,...commonOptions];

