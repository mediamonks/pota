import{_ as s,c as n,o as a,a as t}from"./app.0975428b.js";const g='{"title":"Assets","description":"","frontmatter":{},"headers":[{"level":2,"title":"Webpack Assets","slug":"webpack-assets"},{"level":3,"title":"Source locations","slug":"source-locations"},{"level":3,"title":"Output locations","slug":"output-locations"},{"level":3,"title":"Asset imports / references","slug":"asset-imports-references"},{"level":2,"title":"Site Assets","slug":"site-assets"},{"level":3,"title":"Source locations","slug":"source-locations-1"},{"level":3,"title":"Output locations","slug":"output-locations-1"},{"level":3,"title":"Asset imports / references","slug":"asset-imports-references-1"},{"level":2,"title":"Data Assets","slug":"data-assets"},{"level":3,"title":"Source locations","slug":"source-locations-2"},{"level":3,"title":"Output locations","slug":"output-locations-2"},{"level":3,"title":"Asset imports / references","slug":"asset-imports-references-2"}],"relativePath":"combinations/muban/assets.md","lastUpdated":1646931738000}',e={},o=t(`<h1 id="assets" tabindex="-1">Assets <a class="header-anchor" href="#assets" aria-hidden="true">#</a></h1><p>Assets are any non-code (js/css/html) files (images, fonts, json, etc) that can be imported from different places.</p><p>There are 3 types of assets that we have to deal with:</p><ol><li>Assets imported from TypeScript or CSS files, that will be processed by webpack.</li><li>Assets referenced from HTML or loaded from TypeScript (e.g. using <code>fetch</code>), which are copied over manually.</li><li>Assets linked to in the page data files or storybook mock files, which should normally come from the CMS, and are only copied over when performing a preview build. These assets can be imported through webpack (preferred) or referenced as a string (not recommended).</li></ol><p>Make sure to understand when and how to use each of them by reading the more detailed information below.</p><h2 id="webpack-assets" tabindex="-1">Webpack Assets <a class="header-anchor" href="#webpack-assets" aria-hidden="true">#</a></h2><p>These assets are imported in TypeScript or referenced in SCSS files in a way that webpack understands them. This causes them to be automatically copied to the <code>dist</code> folder on a build, and webpack adds a <code>[contenthash]</code> in the filename to bust the cache if the file contents changed.</p><h3 id="source-locations" tabindex="-1">Source locations <a class="header-anchor" href="#source-locations" aria-hidden="true">#</a></h3><p>These files can be placed in two locations:</p><ol><li>In <code>src/assets</code> for &quot;global&quot; assets used by multiple components. Ideally subfolders are created for each asset type.</li><li>In your component, e.g. <code>src/components/organisms/o35-something/images/pattern-1.png</code> if only a single component uses them.</li></ol><h3 id="output-locations" tabindex="-1">Output locations <a class="header-anchor" href="#output-locations" aria-hidden="true">#</a></h3><p>These files will be outputted based on type in the place: <code>dist/site/static/[type]/[name].[chunkhash][ext]</code></p><ul><li>Example image: <code>dist/site/static/img/component-test.68df72aa.jpg</code></li><li>Example font: <code>dist/site/static/fonts/font-name.68df72aa.woff2</code></li></ul><p>You shouldn&#39;t have to know where they are outputted, since, those paths are included inside your bundled JavaScript and CSS files by webpack, so will be loaded automatically.</p><h3 id="asset-imports-references" tabindex="-1">Asset imports / references <a class="header-anchor" href="#asset-imports-references" aria-hidden="true">#</a></h3><p>These assets should be referenced using relative paths, use like any other file processed by webpack.</p><ul><li>from TypeScript: <code>import componentImage from &#39;./images/component-test.jpg&#39;;</code></li><li>from CSS: <code>background-image: url(&#39;../../../assets/images/webpack-test.jpg&#39;);</code></li></ul><h4 id="examples" tabindex="-1">Examples <a class="header-anchor" href="#examples" aria-hidden="true">#</a></h4><p>Loading an image from within your component folder.</p><div class="language-ts"><pre><code><span class="token comment">// src/components/atoms/image-test/ImageTest.ts</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> defineComponent<span class="token punctuation">,</span> computed<span class="token punctuation">,</span> bind <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@muban/muban&#39;</span><span class="token punctuation">;</span>
<span class="token comment">// this will be handled by webpack, \`componentImage\` will contain the URL to the image</span>
<span class="token keyword">import</span> componentImage <span class="token keyword">from</span> <span class="token string">&#39;./images/component-test.jpg&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token string">&#39;./image-test.scss&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> ImageTest <span class="token operator">=</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  name<span class="token operator">:</span> <span class="token string">&#39;image-test&#39;</span><span class="token punctuation">,</span>
  refs<span class="token operator">:</span> <span class="token punctuation">{</span>
    jsImage<span class="token operator">:</span> <span class="token string">&#39;js-image&#39;</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function">setup</span><span class="token punctuation">(</span><span class="token punctuation">{</span> refs <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">[</span><span class="token function">bind</span><span class="token punctuation">(</span>refs<span class="token punctuation">.</span>jsImage<span class="token punctuation">,</span> <span class="token punctuation">{</span> attr<span class="token operator">:</span> <span class="token punctuation">{</span> src<span class="token operator">:</span> <span class="token function">computed</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> componentImage<span class="token punctuation">)</span> <span class="token punctuation">}</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre></div><p>Loading a &quot;global&quot; image from your CSS file.</p><div class="language-scss"><pre><code><span class="token comment">// src/components/atoms/image-test/ImageTest.styles.scss</span>
<span class="token selector">[data-component=&#39;image-test&#39;] </span><span class="token punctuation">{</span>
  <span class="token selector">.css-image </span><span class="token punctuation">{</span>
    <span class="token comment">// loads a global asset, webpack will replace this with the output file URL</span>
    <span class="token comment">// TODO: potentially we can create an import shortcut to this global folder</span>
    <span class="token property">background-image</span><span class="token punctuation">:</span> <span class="token url">url</span><span class="token punctuation">(</span><span class="token string">&#39;../../../assets/images/webpack-test.jpg&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token property">height</span><span class="token punctuation">:</span> 300px<span class="token punctuation">;</span>
    <span class="token property">background-position</span><span class="token punctuation">:</span> center<span class="token punctuation">;</span>
    <span class="token property">background-size</span><span class="token punctuation">:</span> cover<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token selector">&gt; div &gt; img </span><span class="token punctuation">{</span>
    <span class="token property">height</span><span class="token punctuation">:</span> 300px<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div><blockquote><p>TODO: Add example for using seng-css paths</p><ul><li><code>$pathAsset</code> \u2013 default project asset path</li><li><code>$pathFont</code> \u2013 default project font path (font, prefixed with <code>$pathAsset</code>)</li><li><code>$pathImage</code> \u2013 default project image path (image, prefixed with <code>$pathAsset</code>)</li></ul></blockquote><h2 id="site-assets" tabindex="-1">Site Assets <a class="header-anchor" href="#site-assets" aria-hidden="true">#</a></h2><p>These assets are imported without webpack knowing about them, and are copied over using the <code>CopyWebpackPlugin</code>. Anything in your HTML files that should not be CMSable (e.g. part of the design or function).</p><h3 id="source-locations-1" tabindex="-1">Source locations <a class="header-anchor" href="#source-locations-1" aria-hidden="true">#</a></h3><p>These files exist in a single location, with 2 dedicated folders based on the use.</p><ol><li>In <code>public/</code> for anything that needs to end up in the webroot (only for very few specific files).</li><li>In <code>public/static/</code> for anything else, like images, videos or json files. Ideally with a sub-folder for each type.</li></ol><h3 id="output-locations-1" tabindex="-1">Output locations <a class="header-anchor" href="#output-locations-1" aria-hidden="true">#</a></h3><p>These files will be copied over as is to the dist folder.</p><ul><li><code>public/</code> &gt; <code>dist/site/</code></li><li><code>public/static/</code> &gt; <code>dist/site/static/</code></li></ul><h3 id="asset-imports-references-1" tabindex="-1">Asset imports / references <a class="header-anchor" href="#asset-imports-references-1" aria-hidden="true">#</a></h3><p>These assets should be referenced absolutely, beginning with <code>/static/</code>.</p><ul><li>from HTML: <code>&lt;img src=&quot;/static/images/template-test.jpg&quot; /&gt;</code></li><li>from TypeScript: <code>fetch(&#39;/static/json/data.json&#39;);</code></li></ul><div class="warning custom-block"><p class="custom-block-title">publicPath</p><p>If you specify a different <code>publicPath</code> through the <code>--public-path</code> argument when running <code>npm run build</code>, you should prepend <code>process.<wbr>env.PUBLIC_PATH</code> to all of your assets paths.</p></div><h4 id="examples-1" tabindex="-1">Examples <a class="header-anchor" href="#examples-1" aria-hidden="true">#</a></h4><p>Loading an image inside your template.</p><div class="language-ts"><pre><code><span class="token comment">// src/components/atoms/image-test/ImageTest.template.ts</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">imageTestTemplate</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> html<span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">&lt;div data-component=&quot;image-test&quot;&gt;
    &lt;div&gt;
      &lt;h1&gt;Template Image&lt;/h1&gt;
      &lt;!-- TODO: publicPath --&gt;
      &lt;img src=&quot;/static/images/template-test.jpg&quot; /&gt;
    &lt;/div&gt;
  &lt;/div&gt;</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><p>Loading JSON inside your TypeScript files.</p><div class="language-ts"><pre><code><span class="token comment">// src/components/atoms/image-test/ImageTest.template.ts</span>
<span class="token keyword">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">loadData</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// TODO: publicPath</span>
  <span class="token keyword">return</span> <span class="token function">fetch</span><span class="token punctuation">(</span><span class="token string">&#39;/static/json/data.json&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><h2 id="data-assets" tabindex="-1">Data Assets <a class="header-anchor" href="#data-assets" aria-hidden="true">#</a></h2><p>These assets should only be used in your page data files or story mock files. If you import them through webpack, these files are only processed as part of storybook or a preview build. The files in the <code>pages/public/static</code> folder are also copied over manually using the <code>CopyWebpackPlugin</code> for <code>npm run build -- --preview</code> builds, in case you reference these files as strings (which has some caveats).</p><p>On your production website, generally these assets will be managed by the CMS, so this is purely for mocking / previewing.</p><h3 id="source-locations-2" tabindex="-1">Source locations <a class="header-anchor" href="#source-locations-2" aria-hidden="true">#</a></h3><p>These files can exist in two locations:</p><ol><li><code>src/pages/public/static/</code> only to be used by your <code>src/pages/**/*.ts</code> data files.</li><li>Inside your component files, only used by mock data / story files, like <code>src/components/atoms/image-test/mocks/mock-component-test.jpg</code>.</li></ol><h3 id="output-locations-2" tabindex="-1">Output locations <a class="header-anchor" href="#output-locations-2" aria-hidden="true">#</a></h3><p>These files will be copied over as is to the dist folder.</p><ol><li>Webpack <ul><li><code>src/pages/static/imags/foo.jpg</code> &gt; <code>dist/site/static/images/component-test.68df72aa.jpg</code></li><li><code>src/components/atoms/image-test/mocks/mock-component-test.jpg</code> &gt; <code>dist/site/static/images/mock-component-test.38df32ab.jpg</code></li></ul></li><li>Copy: <code>src/pages/public/static/</code> &gt; <code>dist/site/static</code></li></ol><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>The <code>src/pages/public/static/</code> folder will be merged with the <code>public/static/</code> folder, so make sure the filenames don&#39;t clash, or use &quot;each others&quot; files.</p></div><h3 id="asset-imports-references-2" tabindex="-1">Asset imports / references <a class="header-anchor" href="#asset-imports-references-2" aria-hidden="true">#</a></h3><p>To have this work in all cases, it&#39;s best to always use <code>import</code>/<code>require</code> to reference these mock assets. Another option is to use string values starting with <code>/static</code>/.</p><ul><li>from TS page data using require (recommended):</li></ul><div class="language-ts"><pre><code><span class="token comment">// top of file</span>
<span class="token keyword">import</span> mockTest <span class="token keyword">from</span> <span class="token string">&#39;./static/images/mock-test.jpg&#39;</span><span class="token punctuation">;</span>
<span class="token comment">// in template data function</span>
props<span class="token operator">:</span> <span class="token punctuation">{</span>
  dataImage<span class="token operator">:</span> mockTest<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><ul><li>from TS page data using string (not recommended):</li></ul><div class="language-ts"><pre><code><span class="token comment">// in template data function</span>
props<span class="token operator">:</span> <span class="token punctuation">{</span>
  dataImage<span class="token operator">:</span> <span class="token string">&#39;/static/images/mock-test.jpg&#39;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><p><code>props: { dataImage: &#39;/static/images/mock-test.jpg&#39; }</code></p><ul><li>from your mock data file or story file inside the component folder:</li></ul><div class="language-ts"><pre><code><span class="token comment">// top of file</span>
<span class="token keyword">import</span> mockTest <span class="token keyword">from</span> <span class="token string">&#39;./mocks/mock-test.jpg&#39;</span><span class="token punctuation">;</span>
<span class="token comment">// in template data function</span>
props<span class="token operator">:</span> <span class="token punctuation">{</span>
  dataImage<span class="token operator">:</span> mockTest<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><div class="warning custom-block"><p class="custom-block-title">publicPath</p><p>If you specify a different <code>publicPath</code> through the <code>--public-path</code> argument when running <code>npm run build</code>, you should prepend <code>process.<wbr>env.PUBLIC_PATH</code> to all of your assets paths.</p></div><div class="warning custom-block"><p class="custom-block-title">string paths</p><p>To work properly during dev and preview builds, when using string paths you need to use the <code>publicPath</code> (starting with <code>/</code>), which doesn&#39;t work when deploying storybook in sub folders.</p></div><div class="warning custom-block"><p class="custom-block-title">Preview only</p><p>These assets will only be copied over to the <code>dist</code> folder when running <code>npm run build</code>, and are not part of the build that will be integrated into the CMS.</p></div><h4 id="examples-2" tabindex="-1">Examples <a class="header-anchor" href="#examples-2" aria-hidden="true">#</a></h4><p>Loading an image inside your template.</p><div class="language-ts"><pre><code><span class="token comment">// src/pages/image-test.ts</span>
<span class="token keyword">import</span> <span class="token keyword">type</span> <span class="token punctuation">{</span> AppTemplateProps <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../App.template&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> mockTest <span class="token keyword">from</span> <span class="token string">&#39;./static/images/mock-test.jpg&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> data <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> AppTemplateProps <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span>
  layout<span class="token operator">:</span> <span class="token punctuation">{</span>
    name<span class="token operator">:</span> <span class="token string">&#39;layout-default&#39;</span><span class="token punctuation">,</span>
    props<span class="token operator">:</span> <span class="token punctuation">{</span>
      blocks<span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
          name<span class="token operator">:</span> <span class="token string">&#39;image-test&#39;</span><span class="token punctuation">,</span>
          props<span class="token operator">:</span> <span class="token punctuation">{</span>
            dataImage<span class="token operator">:</span> mockTest<span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre></div><div class="language-ts"><pre><code><span class="token comment">// src/components/atoms/image-test/ImageTest.template.ts</span>
<span class="token keyword">export</span> <span class="token keyword">type</span> <span class="token class-name">ImageTestProps</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  dataImage<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">imageTestTemplate</span><span class="token punctuation">(</span><span class="token punctuation">{</span> dataImage <span class="token punctuation">}</span><span class="token operator">:</span> ImageTestProps<span class="token punctuation">,</span> ref<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> html<span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">&lt;div data-component=&quot;image-test&quot;&gt;
    &lt;div&gt;
      &lt;h1&gt;Data Image&lt;/h1&gt;
      &lt;img src=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>dataImage<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> /&gt;
    &lt;/div&gt;
  &lt;/div&gt;</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><p>Or using per-component mock files</p><div class="language-ts"><pre><code><span class="token comment">// src/pages/image-test.ts</span>
<span class="token keyword">import</span> <span class="token keyword">type</span> <span class="token punctuation">{</span> AppTemplateProps <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../App.template&#39;</span><span class="token punctuation">;</span>
<span class="token comment">// import from the component folder to be reusable</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> imageTestDefaultMockData <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../components/atoms/image-test/ImageTest.mocks&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> data <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> AppTemplateProps <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span>
  layout<span class="token operator">:</span> <span class="token punctuation">{</span>
    name<span class="token operator">:</span> <span class="token string">&#39;layout-default&#39;</span><span class="token punctuation">,</span>
    props<span class="token operator">:</span> <span class="token punctuation">{</span>
      blocks<span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
          name<span class="token operator">:</span> <span class="token string">&#39;image-test&#39;</span><span class="token punctuation">,</span>
          props<span class="token operator">:</span> imageTestDefaultMockData<span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre></div><div class="language-ts"><pre><code><span class="token comment">// src/components/atoms/image-test/ImageTest.mocks.ts</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> ImageTestProps <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./ImageTest.template&#39;</span><span class="token punctuation">;</span>
<span class="token comment">// loading the file inside the component folder</span>
<span class="token comment">// using a dedicated mock folder to make clear it&#39;s just for mocking</span>
<span class="token keyword">import</span> mockComponentTest <span class="token keyword">from</span> <span class="token string">&#39;./mocks/mock-component-test.jpg&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> imageTestDefaultMockData<span class="token operator">:</span> ImageTestProps <span class="token operator">=</span> <span class="token punctuation">{</span>
  dataImage<span class="token operator">:</span> mockComponentTest<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre></div><p>The mock file can also be used in stories.</p><div class="language-ts"><pre><code><span class="token comment">// src/components/atoms/image-test/ImageTest.stories.ts</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> imageTestDefaultMockData <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./ImageTest.mocks&#39;</span><span class="token punctuation">;</span>
<span class="token comment">// local asset</span>
<span class="token keyword">import</span> mockComponentTest <span class="token keyword">from</span> <span class="token string">&#39;./mocks/mock-component-test.jpg&#39;</span><span class="token punctuation">;</span>
<span class="token comment">// global assets (not ideal, but fine to do)</span>
<span class="token keyword">import</span> mockTest <span class="token keyword">from</span> <span class="token string">&#39;../../../pages/static/images/mock-test.jpg&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> Default<span class="token operator">:</span> Story<span class="token operator">&lt;</span>ImageTestProps<span class="token operator">&gt;</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">{</span>
  component<span class="token operator">:</span> ImageTest<span class="token punctuation">,</span>
  template<span class="token operator">:</span> imageTestTemplate <span class="token keyword">as</span> <span class="token builtin">any</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// local asset, using webpack require</span>
Default<span class="token punctuation">.</span>args <span class="token operator">=</span> <span class="token punctuation">{</span>
  dataImage<span class="token operator">:</span> mockComponentTest<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token comment">// local asset, reusing the same mock data</span>
Default<span class="token punctuation">.</span>args <span class="token operator">=</span> imageTestDefaultMockData<span class="token punctuation">;</span>

<span class="token comment">// local asset, using path (not recommended, not possible)</span>
Default<span class="token punctuation">.</span>args <span class="token operator">=</span> <span class="token punctuation">{</span>
  dataImage<span class="token operator">:</span> <span class="token string">&#39;&#39;</span> <span class="token comment">/* not possible */</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token comment">// global assets, using webpack require (not ideal, but fine to do)</span>
Default<span class="token punctuation">.</span>args <span class="token operator">=</span> <span class="token punctuation">{</span>
  dataImage<span class="token operator">:</span> mockTest<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token comment">// global assets, using string path (not recommended)</span>
Default<span class="token punctuation">.</span>args <span class="token operator">=</span> <span class="token punctuation">{</span>
  dataImage<span class="token operator">:</span> <span class="token string">&#39;/static/images/mock-test.jpg&#39;</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre></div>`,71),p=[o];function c(l,i,r,u,k,d){return a(),n("div",null,p)}var h=s(e,[["render",c]]);export{g as __pageData,h as default};
