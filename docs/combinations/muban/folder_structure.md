# Folder Structure

A list of the folders and most important files inside a standard Muban project.

- `.storybook/` – Contains the
  [storybook configuration](https://storybook.js.org/docs/react/configure/overview).

- `dist/` – Contains the output of the `build` commands.
  - `site/` – The website assets, can be moved to the CMS or deployed when a `build:preview` was
    used.
  - `node/` – Contains a node-js project to be deployed to offer a API mock service.
  - `storybook/` – Contains a storybook build.
- `mocks/` – Contains API mock files used by
  [@mediamonks/monck](https://github.com/mediamonks/monck#readme).

- `public/` – Contents of this folder will be copied over to the `dist/site`, and should contain
  files that will be accessed from the HTML templates or `fetch`. These are not processed by webpack
  (just copied over), and the filenames will stay the same (no `[contenthash]` is added). In the
  future, we could consider versioning parts of this folder.

- `src/` – All your project code.

  - `assets/` – All non-js/css assets (e.g. images, video, fonts, etc) that you require directly in
    your JS/CSS and gets automatically processed by webpack. These file will get a `[contenthash]`
    in their filename to be different in each build if they have changed.
  - `components/` – All your Muban Components, both UI and non-UI. For UI components we try to use
    atomic design, so expect the `atoms` `molecules` and `organisms` folders in here as well.
    There's also a `layouts` folder (which can be seen as page templates).
  - `pages/` – Contains the page data files, used to render and preview the website pages. Pages are
    rendered using the templates, and the `src/App.template.ts` is the entrypoint for all.
    - `_main.ts` – The entry point for the pages bundle, re-exports the `App.template.ts` and
      exports a `pages` object containing the `data` functions for each page.
    - `public/` – Contains the base `.html` use to generate each page and a `static/` directory for
      assets that come from the CMS. Contents will only be copied over to the `dist` folder when
      doing a preview build.
  - `styles/` - All styling (`.scss` files) for the project.
  - `main.ts` – The entry point for the Muban application.
