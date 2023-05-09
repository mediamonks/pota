import{_ as e,c as t,o,a as n}from"./app.0975428b.js";const b='{"title":"Scripts","description":"","frontmatter":{},"headers":[{"level":2,"title":"Development","slug":"development"},{"level":3,"title":"npm run dev","slug":"npm-run-dev"},{"level":3,"title":"npm run dev -- --mock-api","slug":"npm-run-dev-mock-api"},{"level":3,"title":"npm run build -- --watch","slug":"npm-run-build-watch"},{"level":3,"title":"npm run build -- --debug --watch","slug":"npm-run-build-debug-watch"},{"level":3,"title":"npm run storybook","slug":"npm-run-storybook"},{"level":3,"title":"npm run storybook:mock-api","slug":"npm-run-storybook-mock-api"},{"level":2,"title":"Builds","slug":"builds"},{"level":3,"title":"npm run build","slug":"npm-run-build"},{"level":3,"title":"npm run build:preview","slug":"npm-run-build-preview"},{"level":3,"title":"npm run build -- --debug","slug":"npm-run-build-debug"},{"level":3,"title":"npm run build -- --mock-api","slug":"npm-run-build-mock-api"},{"level":3,"title":"npm run storybook:build","slug":"npm-run-storybook-build"},{"level":2,"title":"Others","slug":"others"},{"level":3,"title":"previewing the build","slug":"previewing-the-build"},{"level":3,"title":"uploading the build to a remote server","slug":"uploading-the-build-to-a-remote-server"},{"level":3,"title":"Formatting/Linting","slug":"formatting-linting"}],"relativePath":"combinations/muban/scripts.md","lastUpdated":1681473882000}',r={},d=n(`<h1 id="scripts" tabindex="-1">Scripts <a class="header-anchor" href="#scripts" aria-hidden="true">#</a></h1><p>The <code>package.json</code> is filled with scripts you can use to do all sorts of things in your project. The most important ones are described below.</p><h2 id="development" tabindex="-1">Development <a class="header-anchor" href="#development" aria-hidden="true">#</a></h2><h3 id="npm-run-dev" tabindex="-1"><code>npm run dev</code> <a class="header-anchor" href="#npm-run-dev" aria-hidden="true">#</a></h3><p>Your goto script when running local development against local page templates with live and hot reloading when any of your code changes.</p><p>It runs on a pair of webpack compilers: one for the Muban application bundle and one for converting page TypeScript files into HTML files.</p><p>The dev server runs on <code>http://localhost:9000</code>.</p><h3 id="npm-run-dev-mock-api" tabindex="-1"><code>npm run dev -- --mock-api</code> <a class="header-anchor" href="#npm-run-dev-mock-api" aria-hidden="true">#</a></h3><p>Runs the development server with an mock API middleware compiling the mocks from the <code>/mocks</code> directory.</p><h3 id="npm-run-build-watch" tabindex="-1"><code>npm run build -- --watch</code> <a class="header-anchor" href="#npm-run-build-watch" aria-hidden="true">#</a></h3><p>Runs the same build process as the normal <code>npm run build</code>, but now in watch mode, enjoying fast recompilations when your local files change.</p><h3 id="npm-run-build-debug-watch" tabindex="-1"><code>npm run build -- --debug --watch</code> <a class="header-anchor" href="#npm-run-build-debug-watch" aria-hidden="true">#</a></h3><p>Runs the same build process as the normal <code>npm run build -- --watch</code>, but the output code is without production optimizations.</p><p>Useful for live local development against your CMS rendered pages.</p><h3 id="npm-run-storybook" tabindex="-1"><code>npm run storybook</code> <a class="header-anchor" href="#npm-run-storybook" aria-hidden="true">#</a></h3><p>Develop and test your components in storybook.</p><h3 id="npm-run-storybook-mock-api" tabindex="-1"><code>npm run storybook:mock-api</code> <a class="header-anchor" href="#npm-run-storybook-mock-api" aria-hidden="true">#</a></h3><p>Same as <code>npm run storybook</code>, but with the mock API bundling and middleware enabled.</p><h2 id="builds" tabindex="-1">Builds <a class="header-anchor" href="#builds" aria-hidden="true">#</a></h2><h3 id="npm-run-build" tabindex="-1"><code>npm run build</code> <a class="header-anchor" href="#npm-run-build" aria-hidden="true">#</a></h3><p>Creates a distribution build that outputs the JavaScript, CSS and bundled asset files. Used in CI to deploy to your production websites.</p><h3 id="npm-run-build-preview" tabindex="-1"><code>npm run build:preview</code> <a class="header-anchor" href="#npm-run-build-preview" aria-hidden="true">#</a></h3><p>Generates a full preview package including generated HTML files to upload to a preview server that&#39;s not connected to any backend.</p><h3 id="npm-run-build-debug" tabindex="-1"><code>npm run build -- --debug</code> <a class="header-anchor" href="#npm-run-build-debug" aria-hidden="true">#</a></h3><p>Generates a debug build without any minification or other optimizations. Useful for integration tests where you are not deploying to production yet, but want to see your changes on a (local) integration server as soon as possible.</p><h3 id="npm-run-build-mock-api" tabindex="-1"><code>npm run build -- --mock-api</code> <a class="header-anchor" href="#npm-run-build-mock-api" aria-hidden="true">#</a></h3><p>In addition to the standard build, generates a node server for running <a href="https://github.com/mediamonks/monck" target="_blank" rel="noopener noreferrer">monck</a> mocks.</p><h3 id="npm-run-storybook-build" tabindex="-1"><code>npm run storybook:build</code> <a class="header-anchor" href="#npm-run-storybook-build" aria-hidden="true">#</a></h3><p>Make a deployable storybook build to showcase your components to others.</p><blockquote><p>NOTE: if you are unsure about what options you can pass to the <code>dev</code> or <code>build</code> scripts, you can always get more information by passing the <code>--help</code> argument. e.g. <code>npm run build -- --help</code></p></blockquote><h2 id="others" tabindex="-1">Others <a class="header-anchor" href="#others" aria-hidden="true">#</a></h2><h3 id="previewing-the-build" tabindex="-1">previewing the build <a class="header-anchor" href="#previewing-the-build" aria-hidden="true">#</a></h3><p>Sometimes you want to test the build output <code>npm run build:preview</code> to locally debug minification &amp; optimizations applied by webpack in production mode. Instead of shipping a custom server or a dependency to support this, we are recommending to utilize existing packages through <code>npx</code>:</p><blockquote><p>serve <code>./dist/site</code> directory</p></blockquote><div class="language-bash"><pre><code>npx http-server ./dist/site
</code></pre></div><blockquote><p>with SSL/TLS enabled (https)</p></blockquote><div class="language-bash"><pre><code>npx create-ssl-certificate <span class="token operator">&amp;&amp;</span> npx http-server ./dist/site -S -C ssl.crt -K ssl.key
</code></pre></div><blockquote><p>include running the built mocks from <code>./dist/node/mocks</code></p></blockquote><div class="language-bash"><pre><code>npx concurrently <span class="token string">&quot;npx monck -d ./dist/node/mocks -p 9002&quot;</span> <span class="token string">&quot;npx http-server ./dist/site --proxy http://localhost:9002&quot;</span>
</code></pre></div><h3 id="uploading-the-build-to-a-remote-server" tabindex="-1">uploading the build to a remote server <a class="header-anchor" href="#uploading-the-build-to-a-remote-server" aria-hidden="true">#</a></h3><p>If you do not have a backend setup to host your components, you likely still want to deploy your changes to a remote server. The skeleton provides two scripts to support uploading both the preview site and the <a href="https://github.com/mediamonks/monck" target="_blank" rel="noopener noreferrer">monck</a> mocks.</p><ul><li><code>npm run rsync</code> - upload the preview site</li><li><code>npm run rsync:mocks</code> - upload the mocks node server</li><li><code>npm run rsync:storybook</code> - upload the storybook build</li></ul><h3 id="formatting-linting" tabindex="-1">Formatting/Linting <a class="header-anchor" href="#formatting-linting" aria-hidden="true">#</a></h3><table><thead><tr><th>Script</th><th>Description</th></tr></thead><tbody><tr><td><strong><code>typecheck</code></strong></td><td>Checks for type errors and unused variables/types in the source directory.</td></tr><tr><td><strong><code>fix</code></strong></td><td>Executes all <code>fix:*</code> and \`format commands in sequence.</td></tr><tr><td><strong><code>fix:eslint</code></strong></td><td>Executes <code>eslint:lint</code> and fixes fixable errors.</td></tr><tr><td><strong><code>format</code></strong></td><td>Formats the source files using <code>prettier</code>.</td></tr><tr><td><strong><code>lint</code></strong></td><td>Executes all <code>lint:*</code> commands in sequence.</td></tr><tr><td><strong><code>lint:eslint</code></strong></td><td>Lints the source files using <code>eslint</code>.</td></tr></tbody></table>`,44),i=[d];function a(s,l,c,u,p,h){return o(),t("div",null,i)}var g=e(r,[["render",a]]);export{b as __pageData,g as default};