# porter-react-skeleton

The skeleton for React projects

# fixing vue-loader

One of the dependencies included by `@mediamonks/eslint-config` requires an older version of
`vue-loader`. This wrongful resolutions breaks the bundling configuration. To fix it, please append
this to the `package.json`:

```json
  "resolutions": {
    "vue-loader": "^16.1.2"
  },
```

and then run `yarn` to resolve the dependency.

# only development works

Seems like because of the above issue, more dependencies are being wrongfully resolved as part of
the production build.

## Dependencies

The following dependencies are skeleton specific and **must** never be manually upgraded:

<PORTER:dependencies>

The only time when the above dependencies could be manually upgraded is, if the project won't be
using porter's `upgrade` command.
