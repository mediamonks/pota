import { options as webpackSkeletonOptions } from "@pota/webpack-skeleton/pota/commands/dev.js"

export { description, action } from "@pota/webpack-skeleton/pota/commands/dev.js"

import commonOptions from "../internal/commonOptions.js"

export const options = [...webpackSkeletonOptions, ...commonOptions];

