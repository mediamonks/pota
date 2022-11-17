# Twig Support

Besides the default TypeScript templates that is the preferred way to start a project, the skeleton also has support for [Twig](https://twig.symfony.com/) files. By default this is disabled, but the files do exist in the skeleton.

When starting a project, you have the choice:

1. Remove Twig, because you're not going to use it.
2. Enable Twig, because you want to make use of it.

## Remove Twig

The project contains a script that will remove all the twig related files. You can run the script by executing:

```sh
node scripts/clean-twig.js
```

And then commit your changes.

> If you don't remove the twig files, it won't do any harm, except for cluttering your filesystem. As long as the `config.twig-support` in the `package.json` is set to `false`, it doesn't use any of the twig related files.

## Enable Twig

Edit your `package.json` file to set `config.twig-support` to `true`.

```json
// package.json
{
  ...
  "config": {  
	"twig-support": true
  },
  ...
}
```

With this enabled, it starts executing the twig code paths, and your typescript templates are not used anymore (unless you don't switch to server-side rendering in storybook).

# How does it all work?

The `muban-webpack-scripts` package has built-in support for twig templates, by enabling a few small additions.

## twing

It uses [Twing](https://www.npmjs.com/package/twing), a node.js package that aligns with the official Twig specification, allowing us to write templates in twig, but still make use of javascript-based build tooling.

Twing works by setting up a _Twig Environment_, that defines how files are loaded and cached, and allows you to add your custom Twig filters and functions.

The `muban-webpack-scripts` packages has its own `twigEnvironment.js` file, but most likely you want to have your own in your project to add custom filters and functions.

## twing-loader

It enables the [twing-laoder](https://www.npmjs.com/package/twing-loader) when rendering pages, so your `app.twig` and all other templates are correctly processed.

## pota config

Our project contains a default `pota.config.js` to configure our Twig Environment. It does so by overriding the `twigEnvironmentPath` getter:

```ts
// pota.config.js
class ProjectWebpackConfig extends MubanWebpackConfig {
  get twigEnvironmentPath() {  
    return require.resolve('./config/twig/twigEnvironment.cjs')  
  }
}
```

> The pota configuration is used in the `dev` and `build` commands.

## storybook middleware

In `.storybook/middleware.js` – that allows you to enhance the express node.js server that servces storybook itself – there is a route that can render templates "on the server".

In our storybook and stories we can configure it to render story templates on the server by executing a `fetch` request with the component ID and parameters, that is then handled by the storybook middleware.

There it renders the component twig file, and returns the HTML to display in storybook.

The storybook middleware also creates a Twig Environment, and enhances it with the same extensions as is done in the `twigEnvironment.cjs` that is used in the pota config.

## extending twig

The `config/twig/twig-extensions.cjs` contains a `addExtensions` function to allow extending the passed environment. You can use the `env.addFilter` and `env.addFunction`, and pass the configuration and logic.

Some things to note:

* The code is `commonjs` to work in all environments.
* Added filters/functions should return a promise.
* Objects defined in the twig templates are converted to `Map`s, so you might want to convert those parameters back to an `object`.
* If you're outputting "raw html", you need to mark it as safe so it doesn't get escaped.
* Any custom filter or function you're adding must also be created in PHP, so make sure to add proper documentation and/or tests.

## pages bundle

When using typescript, the `src/pages/_main.ts` is used to export the `App.template.ts` (the application starting point) and all the page data files.

A similar file exists for twig, called `src/pages/_main.twig.ts` that exports the `app.twig` and all the same page data files, but additionally requires all twig templates in the projects to make them available for inclusion in other templates.