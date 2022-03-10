# Assets

Assets are any non-code (js/css/html) files (images, fonts, json, etc) that can be imported from
different places.

There are 3 types of assets that we have to deal with:

1. Assets imported from TypeScript or CSS files, that will be processed by webpack.
2. Assets referenced from HTML or loaded from TypeScript (e.g. using `fetch`), which are copied over
   manually.
3. Assets linked to in the page data files or storybook mock files, which should normally come from
   the CMS, and are only copied over when performing a preview build. These assets can be imported
   through webpack (preferred) or referenced as a string (not recommended).

Make sure to understand when and how to use each of them by reading the more detailed information
below.

## Webpack Assets

These assets are imported in TypeScript or referenced in SCSS files in a way that webpack
understands them. This causes them to be automatically copied to the `dist` folder on a build, and
webpack adds a `[contenthash]` in the filename to bust the cache if the file contents changed.

### Source locations

These files can be placed in two locations:

1. In `src/assets` for "global" assets used by multiple components. Ideally subfolders are created
   for each asset type.
2. In your component, e.g. `src/components/organisms/o35-something/images/pattern-1.png` if only a
   single component uses them.

### Output locations

These files will be outputted based on type in the place:
`dist/site/static/[type]/[name].[chunkhash][ext]`

- Example image: `dist/site/static/img/component-test.68df72aa.jpg`
- Example font: `dist/site/static/fonts/font-name.68df72aa.woff2`

You shouldn't have to know where they are outputted, since, those paths are included inside your
bundled JavaScript and CSS files by webpack, so will be loaded automatically.

### Asset imports / references

These assets should be referenced using relative paths, use like any other file processed by
webpack.

- from TypeScript: `import componentImage from './images/component-test.jpg';`
- from CSS: `background-image: url('../../../assets/images/webpack-test.jpg');`

#### Examples

Loading an image from within your component folder.

```ts
// src/components/atoms/image-test/ImageTest.ts
import { defineComponent, computed, bind } from '@muban/muban';
// this will be handled by webpack, `componentImage` will contain the URL to the image
import componentImage from './images/component-test.jpg';

import './image-test.scss';

export const ImageTest = defineComponent({
  name: 'image-test',
  refs: {
    jsImage: 'js-image',
  },
  setup({ refs }) {
    return [bind(refs.jsImage, { attr: { src: computed(() => componentImage) } })];
  },
});
```

Loading a "global" image from your CSS file.

```scss
// src/components/atoms/image-test/ImageTest.styles.scss
[data-component='image-test'] {
  .css-image {
    // loads a global asset, webpack will replace this with the output file URL
    // TODO: potentially we can create an import shortcut to this global folder
    background-image: url('../../../assets/images/webpack-test.jpg');
    height: 300px;
    background-position: center;
    background-size: cover;
  }
  > div > img {
    height: 300px;
  }
}
```

> TODO: Add example for using seng-css paths
>
> - `$pathAsset` – default project asset path
> - `$pathFont` – default project font path (font, prefixed with `$pathAsset`)
> - `$pathImage` – default project image path (image, prefixed with `$pathAsset`)

## Site Assets

These assets are imported without webpack knowing about them, and are copied over using the
`CopyWebpackPlugin`. Anything in your HTML files that should not be CMSable (e.g. part of the design
or function).

### Source locations

These files exist in a single location, with 2 dedicated folders based on the use.

1. In `public/` for anything that needs to end up in the webroot (only for very few specific files).
2. In `public/static/` for anything else, like images, videos or json files. Ideally with a
   sub-folder for each type.

### Output locations

These files will be copied over as is to the dist folder.

- `public/` > `dist/site/`
- `public/static/` > `dist/site/static/`

### Asset imports / references

These assets should be referenced absolutely, beginning with `/static/`.

- from HTML: `<img src="/static/images/template-test.jpg" />`
- from TypeScript: `fetch('/static/json/data.json');`

::: warning publicPath

If you specify a different `publicPath` through the `--public-path` argument when running
`npm run build`, you should prepend `process.env.PUBLIC_PATH` to all of your assets paths.

:::

#### Examples

Loading an image inside your template.

```ts
// src/components/atoms/image-test/ImageTest.template.ts
export function imageTestTemplate({}) {
  return html`<div data-component="image-test">
    <div>
      <h1>Template Image</h1>
      <!-- TODO: publicPath -->
      <img src="/static/images/template-test.jpg" />
    </div>
  </div>`;
}
```

Loading JSON inside your TypeScript files.

```ts
// src/components/atoms/image-test/ImageTest.template.ts
export async function loadData() {
  // TODO: publicPath
  return fetch('/static/json/data.json');
}
```

## Data Assets

These assets should only be used in your page data files or story mock files. If you import them
through webpack, these files are only processed as part of storybook or a preview build. The files
in the `pages/public/static` folder are also copied over manually using the `CopyWebpackPlugin` for
`npm run build -- --preview` builds, in case you reference these files as strings (which has some
caveats).

On your production website, generally these assets will be managed by the CMS, so this is purely for
mocking / previewing.

### Source locations

These files can exist in two locations:

1. `src/pages/public/static/` only to be used by your `src/pages/**/*.ts` data files.
2. Inside your component files, only used by mock data / story files, like
   `src/components/atoms/image-test/mocks/mock-component-test.jpg`.

### Output locations

These files will be copied over as is to the dist folder.

1. Webpack
   - `src/pages/static/imags/foo.jpg` > `dist/site/static/images/component-test.68df72aa.jpg`
   - `src/components/atoms/image-test/mocks/mock-component-test.jpg` >
     `dist/site/static/images/mock-component-test.38df32ab.jpg`
2. Copy: `src/pages/public/static/` > `dist/site/static`

::: warning

The `src/pages/public/static/` folder will be merged with the `public/static/` folder, so make sure
the filenames don't clash, or use "each others" files.

:::

### Asset imports / references

To have this work in all cases, it's best to always use `import`/`require` to reference these mock
assets. Another option is to use string values starting with `/static`/.

- from TS page data using require (recommended):

```ts
// top of file
import mockTest from './static/images/mock-test.jpg';
// in template data function
props: {
  dataImage: mockTest;
}
```

- from TS page data using string (not recommended):

```ts
// in template data function
props: {
  dataImage: '/static/images/mock-test.jpg';
}
```

`props: { dataImage: '/static/images/mock-test.jpg' }`

- from your mock data file or story file inside the component folder:

```ts
// top of file
import mockTest from './mocks/mock-test.jpg';
// in template data function
props: {
  dataImage: mockTest;
}
```

::: warning publicPath

If you specify a different `publicPath` through the `--public-path` argument when running
`npm run build`, you should prepend `process.env.PUBLIC_PATH` to all of your assets paths.

:::

::: warning string paths

To work properly during dev and preview builds, when using string paths you need to use the
`publicPath` (starting with `/`), which doesn't work when deploying storybook in sub folders.

:::

::: warning Preview only

These assets will only be copied over to the `dist` folder when running `npm run build`, and are not
part of the build that will be integrated into the CMS.

:::

#### Examples

Loading an image inside your template.

```ts
// src/pages/image-test.ts
import type { AppTemplateProps } from '../App.template';
import mockTest from './static/images/mock-test.jpg';

export const data = (): AppTemplateProps => ({
  layout: {
    name: 'layout-default',
    props: {
      blocks: [
        {
          name: 'image-test',
          props: {
            dataImage: mockTest,
          },
        },
      ],
    },
  },
});
```

```ts
// src/components/atoms/image-test/ImageTest.template.ts
export type ImageTestProps = {
  dataImage?: string;
};

export function imageTestTemplate({ dataImage }: ImageTestProps, ref) {
  return html`<div data-component="image-test">
    <div>
      <h1>Data Image</h1>
      <img src=${dataImage} />
    </div>
  </div>`;
}
```

Or using per-component mock files

```ts
// src/pages/image-test.ts
import type { AppTemplateProps } from '../App.template';
// import from the component folder to be reusable
import { imageTestDefaultMockData } from '../components/atoms/image-test/ImageTest.mocks';

export const data = (): AppTemplateProps => ({
  layout: {
    name: 'layout-default',
    props: {
      blocks: [
        {
          name: 'image-test',
          props: imageTestDefaultMockData,
        },
      ],
    },
  },
});
```

```ts
// src/components/atoms/image-test/ImageTest.mocks.ts
import { ImageTestProps } from './ImageTest.template';
// loading the file inside the component folder
// using a dedicated mock folder to make clear it's just for mocking
import mockComponentTest from './mocks/mock-component-test.jpg';

export const imageTestDefaultMockData: ImageTestProps = {
  dataImage: mockComponentTest,
};
```

The mock file can also be used in stories.

```ts
// src/components/atoms/image-test/ImageTest.stories.ts
import { imageTestDefaultMockData } from './ImageTest.mocks';
// local asset
import mockComponentTest from './mocks/mock-component-test.jpg';
// global assets (not ideal, but fine to do)
import mockTest from '../../../pages/static/images/mock-test.jpg';

export const Default: Story<ImageTestProps> = () => ({
  component: ImageTest,
  template: imageTestTemplate as any,
});

// local asset, using webpack require
Default.args = {
  dataImage: mockComponentTest,
};

// local asset, reusing the same mock data
Default.args = imageTestDefaultMockData;

// local asset, using path (not recommended, not possible)
Default.args = {
  dataImage: '' /* not possible */,
};

// global assets, using webpack require (not ideal, but fine to do)
Default.args = {
  dataImage: mockTest,
};

// global assets, using string path (not recommended)
Default.args = {
  dataImage: '/static/images/mock-test.jpg',
};
```
