import{_ as e,c as t,o as d,a as o}from"./app.0975428b.js";const v='{"title":"React Vite Scripts","description":"","frontmatter":{"title":"React Vite Scripts"},"headers":[{"level":2,"title":"Usage","slug":"usage"},{"level":2,"title":"Commands","slug":"commands"},{"level":3,"title":"build","slug":"build"},{"level":3,"title":"dev","slug":"dev"},{"level":3,"title":"preview","slug":"preview"},{"level":2,"title":"Config Reference [WIP]","slug":"config-reference-wip"}],"relativePath":"scripts/react-vite.md","lastUpdated":1651824631000}',r={},c=o(`<h1 id="react-vite" tabindex="-1">React Vite <a href="https://npmjs.org/package/@pota/react-vite-scripts" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/v/@pota/react-vite-scripts.svg?label=%20" alt=""></a> <a class="header-anchor" href="#react-vite" aria-hidden="true">#</a></h1><p>Commands for building React Frontend applications using <a href="https://github.com/vitejs/vite" target="_blank" rel="noopener noreferrer">vite</a>.</p><div class="info custom-block"><p class="custom-block-title">INFO</p><p>extends <strong><a href="/pota/scripts/vite.html">vite-scripts</a></strong></p></div><h2 id="usage" tabindex="-1">Usage <a class="header-anchor" href="#usage" aria-hidden="true">#</a></h2><blockquote><p>Adding it to an existing project</p></blockquote><div class="language-bash"><pre><code><span class="token comment"># install the react-vite-scripts and cli packages</span>
<span class="token function">npm</span> <span class="token function">install</span> @pota/react-vite-scripts @pota/cli --save-dev

<span class="token comment"># configure the cli package to use react-vite-scripts</span>
<span class="token function">npm</span> pkg <span class="token builtin class-name">set</span> <span class="token assign-left variable">pota</span><span class="token operator">=</span><span class="token string">&quot;@pota/react-vite-scripts&quot;</span>
</code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Want to extend this scripts package?</p><p><strong>Take a look at the <a href="https://github.com/mediamonks/pota/blob/main/core/cli/docs/extending.md" target="_blank" rel="noopener noreferrer">extending section</a> of <code>@pota/cli</code>.</strong></p></div><h2 id="commands" tabindex="-1">Commands <a class="header-anchor" href="#commands" aria-hidden="true">#</a></h2><h3 id="build" tabindex="-1"><code>build</code> <a class="header-anchor" href="#build" aria-hidden="true">#</a></h3><blockquote><p>Create a production bundle.</p></blockquote><div class="language-bash"><pre><code>npx pota build
</code></pre></div><table><thead><tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><strong><code>debug</code></strong></td><td><code>{Boolean}</code></td><td><code>false</code></td><td>Sets NODE_ENV to &#39;development&#39;.</td></tr><tr><td><strong><code>watch</code></strong></td><td><code>{Boolean}</code></td><td><code>false</code></td><td>Run build and watch for changes.</td></tr><tr><td><strong><code>output</code></strong></td><td><code>{String}</code></td><td><code>./dist</code></td><td>The build output directory.</td></tr><tr><td><strong><code>source-map</code></strong></td><td><code>{Boolean}</code></td><td><code>false</code></td><td>Enable source-map generation</td></tr><tr><td><strong><code>force</code></strong></td><td><code>{Boolean}</code></td><td><code>false</code></td><td>Ignore pre-bundled dependencies (the node_modules/.vite cache).</td></tr><tr><td><strong><code>public-path</code></strong></td><td><code>{String}</code></td><td><code>/</code></td><td>The location of static assets on your production server.</td></tr><tr><td><strong><code>log-level</code></strong></td><td><code>{&#39;info&#39; | &#39;warn&#39; | &#39;error&#39; | &#39;silent&#39;}</code></td><td><code>info</code></td><td>Adjust console output verbosity. (<a href="https://vitejs.dev/config/#loglevel" target="_blank" rel="noopener noreferrer">https://vitejs.dev/config/#loglevel</a>)</td></tr></tbody></table><br><h3 id="dev" tabindex="-1">dev <a class="header-anchor" href="#dev" aria-hidden="true">#</a></h3><blockquote><p>Start the development server.</p></blockquote><div class="language-bash"><pre><code>npx pota dev
</code></pre></div><table><thead><tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><strong><code>https</code></strong></td><td><code>{Boolean}</code></td><td><code>false</code></td><td>Enables the server&#39;s listening socket for TLS (by default, dev server will be served over HTTP)</td></tr><tr><td><strong><code>open</code></strong></td><td><code>{Boolean}</code></td><td><code>true</code></td><td>Allows to configure dev server to open the browser after the server has been started.</td></tr><tr><td><strong><code>host</code></strong></td><td><code>{String | Boolean}</code></td><td><code>127.0.01</code></td><td>Specify which IP addresses the server should listen on.</td></tr><tr><td><strong><code>port</code></strong></td><td><code>{Number}</code></td><td><code>2001</code></td><td>Allows configuring the port.</td></tr><tr><td><strong><code>cors</code></strong></td><td><code>{ Boolean }</code></td><td><code>false</code></td><td>Enables CORS.</td></tr><tr><td><strong><code>prod</code></strong></td><td><code>{Boolean}</code></td><td><code>false</code></td><td>Sets NODE_ENV to &#39;production&#39;.</td></tr><tr><td><strong><code>force</code></strong></td><td><code>{Boolean}</code></td><td><code>false</code></td><td>Ignore pre-bundled dependencies (the node_modules/.vite cache).</td></tr><tr><td><strong><code>public-path</code></strong></td><td><code>{String}</code></td><td><code>/</code></td><td>The location of static assets on your production server.</td></tr><tr><td><strong><code>log-level</code></strong></td><td><code>{&#39;info&#39; | &#39;warn&#39; | &#39;error&#39; | &#39;silent&#39;}</code></td><td><code>info</code></td><td>Adjust console output verbosity. (<a href="https://vitejs.dev/config/#loglevel" target="_blank" rel="noopener noreferrer">https://vitejs.dev/config/#loglevel</a>)</td></tr></tbody></table><h3 id="preview" tabindex="-1">preview <a class="header-anchor" href="#preview" aria-hidden="true">#</a></h3><blockquote><p>Locally preview the production build.</p></blockquote><div class="language-bash"><pre><code>npx pota preview
</code></pre></div><table><thead><tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td><strong><code>https</code></strong></td><td><code>{Boolean}</code></td><td><code>false</code></td><td>Enables the server&#39;s listening socket for TLS (by default, dev server will be served over HTTP)</td></tr><tr><td><strong><code>open</code></strong></td><td><code>{Boolean}</code></td><td><code>true</code></td><td>Allows to configure dev server to open the browser after the server has been started.</td></tr><tr><td><strong><code>host</code></strong></td><td><code>{String | Boolean}</code></td><td><code>127.0.01</code></td><td>Specify which IP addresses the server should listen on.</td></tr><tr><td><strong><code>port</code></strong></td><td><code>{Number}</code></td><td><code>2001</code></td><td>Allows configuring the port.</td></tr><tr><td><strong><code>cors</code></strong></td><td><code>{Boolean}</code></td><td><code>false</code></td><td>Enables CORS.</td></tr><tr><td><strong><code>force</code></strong></td><td><code>{Boolean}</code></td><td><code>false</code></td><td>Ignore pre-bundled dependencies (the node_modules/.vite cache).</td></tr><tr><td><strong><code>public-path</code></strong></td><td><code>{String}</code></td><td><code>/</code></td><td>The location of static assets on your production server.</td></tr><tr><td><strong><code>log-level</code></strong></td><td><code>{&#39;info&#39; | &#39;warn&#39; | &#39;error&#39; | &#39;silent&#39;}</code></td><td><code>info</code></td><td>Adjust console output verbosity. (<a href="https://vitejs.dev/config/#loglevel" target="_blank" rel="noopener noreferrer">https://vitejs.dev/config/#loglevel</a>)</td></tr></tbody></table><h2 id="config-reference-wip" tabindex="-1">Config Reference [WIP] <a class="header-anchor" href="#config-reference-wip" aria-hidden="true">#</a></h2><p>see <strong><a href="/pota/scripts/vite.html#config-reference-wip">vite-scripts</a></strong></p>`,23),s=[c];function n(a,i,l,p,h,g){return d(),t("div",null,s)}var f=e(r,[["render",n]]);export{v as __pageData,f as default};