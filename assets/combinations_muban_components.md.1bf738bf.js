import{_ as n,c as s,o as t,a}from"./app.0975428b.js";const h='{"title":"Components","description":"","frontmatter":{},"headers":[{"level":2,"title":"Component files and folders","slug":"component-files-and-folders"},{"level":3,"title":"Folders","slug":"folders"},{"level":3,"title":"Source files","slug":"source-files"},{"level":3,"title":"Supporting files","slug":"supporting-files"}],"relativePath":"combinations/muban/components.md","lastUpdated":1647605642000}',e={},o=a(`<h1 id="components" tabindex="-1">Components <a class="header-anchor" href="#components" aria-hidden="true">#</a></h1><p>What is a site without components? In Muban - like most modern frontend frameworks - everything is a component. From the biggest page to the smallest atom, all of them - and most are composed of - components.</p><h2 id="component-files-and-folders" tabindex="-1">Component files and folders <a class="header-anchor" href="#component-files-and-folders" aria-hidden="true">#</a></h2><p>Within the Muban skeleton we have set on a standard way of writing, organizing and using components, based on lessons learned while working with it. If you wish, you&#39;re free to divert from this in your own project. Even then it is still useful to know why we went this way.</p><h3 id="folders" tabindex="-1">Folders <a class="header-anchor" href="#folders" aria-hidden="true">#</a></h3><p>All components reside in the <code>/src/components/</code> folder. Not for any technical reason, but purely for organisation. The default structure follows the atomic design principle of dividing components between atoms, molecules, organisms and templates. Feel free to to change this and organize them any way you feel, since this decision is project specific.</p><p>Each component has its own folder to contain all the source files related to this component. At its core these are: the TypeScript component, the template and the styles. But other files like storybook stories, mock data or included assets can also be included here.</p><p>A component folder has the same name as its component, but written in <a href="https://en.wikipedia.org/wiki/Snake_case" target="_blank" rel="noopener noreferrer"><code>snake-case</code></a>.</p><div class="language-"><pre><code>/src
  /components
    /atoms
      /my-atom-component
        ...files
      /my-other-atom
        ...files

    /my-component
      ...files
    /my-other-component
      ...files
</code></pre></div><h3 id="source-files" tabindex="-1">Source files <a class="header-anchor" href="#source-files" aria-hidden="true">#</a></h3><p>A component can have one or more source files, where each type is optional[^1], depending on the situation. Important note to keep in mind is that the TypeScript component and the template must be kept in separate files, because, in most cases, the template files are only used during development and for preview builds.</p><p>[^1]: This depends on how we are going to include SCSS files by default.</p><h4 id="typescript-component" tabindex="-1">TypeScript Component <a class="header-anchor" href="#typescript-component" aria-hidden="true">#</a></h4><p>This file is the actual component that gets initialized to make an HTML element interactive.</p><p>It uses <code>PascalCase</code> for both the filename and the export.</p><p>We have chosen to use named exports instead of default ones to be more explicit when importing and using them - keeping the names in sync.</p><div class="language-ts"><pre><code><span class="token comment">// MyComponent.ts</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> MyComponent <span class="token operator">=</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  name<span class="token operator">:</span> <span class="token string">&#39;my-component&#39;</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre></div><p>In most cases <strong>[TBD]</strong>, this file also imports the styles related to this component. Webpack will only include scss files that are imported through components that are actually used.</p><div class="language-ts"><pre><code><span class="token comment">// MyComponent.ts</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> defineComponent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@muban/muban&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token string">&#39;./MyComponent.styles.scss&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> MyComponent <span class="token operator">=</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre></div><p>Including child components can be done in 3 ways:</p><ol><li>Through the <code>components</code> option - these are initialized automatically, but you can&#39;t interact with them. a. Directly referencing them - they are included in the main bundle b. using the <code>lazy</code> function - these components are code-splitted, and only loaded if a matching <code>data-component</code> element exists in the HTML.</li><li>Using the <code>refComponent</code> or <code>refComponents</code> selector, allowing you to read props or apply bindings to these components.</li></ol><div class="language-ts"><pre><code><span class="token comment">// MyComponent.ts</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> MyComponent <span class="token operator">=</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  name<span class="token operator">:</span> <span class="token string">&#39;my-component&#39;</span><span class="token punctuation">,</span>
  components<span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token comment">// 1.a</span>
    MyChildComponent<span class="token punctuation">,</span>
    <span class="token comment">// 1.b</span>
    <span class="token function">lazy</span><span class="token punctuation">(</span><span class="token string">&#39;my-child-component&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">import</span><span class="token punctuation">(</span><span class="token string">&#39;../MyChildComponent/MyChildComponent&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  refs<span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token comment">// 2</span>
    myChildComponent<span class="token operator">:</span> <span class="token function">refComponent</span><span class="token punctuation">(</span>MyChildComponent<span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function">setup</span><span class="token punctuation">(</span><span class="token punctuation">{</span> refs <span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">[</span>
      <span class="token function">bind</span><span class="token punctuation">(</span>resf<span class="token punctuation">.</span>myChildComponent<span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// MyChildComponent.ts</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> MyChildComponent <span class="token operator">=</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  name<span class="token operator">:</span> <span class="token string">&#39;my-child-component&#39;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre></div><div class="tip custom-block"><p class="custom-block-title">Optional</p><p>TypeScript components are not required - sometimes you have partials that only have templates (and styles), but don&#39;t require any interactions or data bindings.</p></div><h4 id="template" tabindex="-1">Template <a class="header-anchor" href="#template" aria-hidden="true">#</a></h4><p>Because we love TypeScript, our templates are just typed functions that return an HTML string. Nesting templates is as easy as calling those functions and passing the right parameters.</p><p>In storybook, we use the story Args to render individual component templates.</p><p>For our preview pages, we use page data functions to pass to our application template, which passes down the data to its child components, where they use it, and pass down the rest, until we reached the last atom templates.</p><p>As said above, templates are only used during development, or when creating a previous build - completely disconnected from the production HTML that is generated by something else. That&#39;s why templates live in their own separate files.</p><p>It uses <code>PascalCase</code>, similar to the JS Component, and append <code>.template</code> after it. It exports a typed template function and the Props <code>type</code> to use in parent components and story files.</p><p>To clearly indicate that the template is separate from the JS Component, and the props belong to the template function, we both append <code>Template</code> to their names.</p><p>The <code>type</code> is <code>PascalCase</code> to follow the TypeScript conventions.</p><p>The template function is <code>camelCase</code> to follow the JavaScript conventions.</p><div class="language-ts"><pre><code><span class="token comment">// MyComponent.template.ts</span>

<span class="token keyword">import</span> <span class="token punctuation">{</span> html <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@muban/template&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">type</span> <span class="token class-name">MyComponentTemplateProps</span> <span class="token operator">=</span> MyChildComponentProps <span class="token operator">&amp;</span> <span class="token punctuation">{</span>
  prop1<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">;</span>
  prop2<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">myComponentTemplate</span><span class="token punctuation">(</span>
  <span class="token punctuation">{</span> prop1<span class="token punctuation">,</span> prop2<span class="token punctuation">,</span> childProp <span class="token punctuation">}</span><span class="token operator">:</span> MyComponentTemplateProps<span class="token punctuation">,</span>
  ref<span class="token operator">?</span><span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">,</span>
<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">string</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> html<span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
    &lt;div data-component=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>MyComponent<span class="token punctuation">.</span>displayName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> data-ref=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>ref<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> data-prop=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>prop2<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&gt;
      &lt;!-- your component html --&gt;
      &lt;h1&gt;</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>prop1<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&lt;/h1&gt;

      &lt;!-- include child template --&gt;
      </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token function">myChildComponentTemplate</span><span class="token punctuation">(</span><span class="token punctuation">{</span> childProp <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">&#39;child-ref&#39;</span><span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">
    &lt;/div&gt;
  </span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre></div><p>Some other things to note;</p><ul><li><p>So you don&#39;t have to repeat any typings, or worry about them getting out of sync, try to reference Prop types of child components a much as possible. Use <code>Pick</code> or <code>Omit</code> if you only need some of those specified props.</p></li><li><p>Always have a container element (doesn&#39;t have to be a <code>div</code>) that includes the <code>data-component</code> attribute, with the same value as the <code>name</code> property you give your Component. To keep these in sync, you reference the <code>displayName</code> on the exported Component.</p></li><li><p>Except for the root component, it&#39;s good practice receiving a <code>ref</code> parameter from the parent template and include it as a <code>data-ref</code> attribute in the same tag as the <code>data-component</code> attribute. This will make sure the parent can choose to specifically target this child component to apply bindings to.</p></li><li><p>Passing a <code>ref</code> as second parameter to child templates is completely optional.</p></li></ul><div class="tip custom-block"><p class="custom-block-title">Optional</p><p>The use of templates in Muban is optional. If you already have existing HTML, either statically or as part of existing website or CMS, it might not be sensible to duplicate everything locally as well. In those cases, you would only write TypeScript components and styles, and won&#39;t use storybook or the dev server at all.</p></div><h4 id="stylesheet" tabindex="-1">Stylesheet <a class="header-anchor" href="#stylesheet" aria-hidden="true">#</a></h4><p>This file contains the styles that style the html for this component. Additionally, it can &quot;override&quot; styles from child components it knows it will include.</p><p>It uses <code>PascalCase</code>, similar to the TypeScript component, and append <code>.styles</code> after it. The component is scoped with its <code>data-component</code> attribute, which is required in the HTML for each component.</p><div class="language-scss"><pre><code><span class="token comment">// MyComponent.styles.scss</span>

<span class="token selector">[data-component=&#39;my-component&#39;] </span><span class="token punctuation">{</span>
  <span class="token comment">// styles</span>

  <span class="token selector">[data-component=&#39;my-other-component&#39;] </span><span class="token punctuation">{</span>
    <span class="token comment">// override styles of all child components of that type</span>
  <span class="token punctuation">}</span>

  <span class="token selector">[dat-ref=&#39;specific-component-instance&#39;] </span><span class="token punctuation">{</span>
    <span class="token comment">// override styles of a single targeted child component</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Because the Muban library is impartial about how you implement your styling, it is up to each project to decide how to write stylesheets, and how to bundle them. In this skeleton, we&#39;ve chosen SCSS.</p><ul><li>Using &quot;css-in-js&quot; does not make sense if your HTML is generated on the server.</li><li>Going full post-css might still miss out on some useful features that SCSS offers.</li></ul><p>However, if your team decides to use something else for styling, that&#39;s perfectly possible.</p></div><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>There are 3 ways to include your scss files to make them end up in your output bundle, each having their own downsides:</p><ol><li><p><strong>Import your styles in the Template files</strong> - since styles are there to enhance your HTML, linking them from the template files feels like the sensible option. It does require a separate build step to extract all those styles from the templates.</p><p>In some cases however - either at the start of the project, or somewhere near the end - you might choose to not use these local templates anymore, but instead use the server rendered pages. Keeping the local and server templates in sync might take too much effort (with the main reason to keep storybook available). In that scenario, there aren&#39;t any template files to include your scss files anymore, which means you need to revert to option 3.</p></li><li><p><strong>Import your styles in the Component files</strong> - However, some &quot;partials&quot; only include HTML and styles, and do not require any JavaScript logic to make them interactive. In that scenario, not every component has a file to include your scss files. This forces us to create files with empty components, or we have to revert to option 3.</p></li><li><p><strong>Glob all scss files in the project</strong> - Setup wise this is the simplest option, but with the downside that if there are any unused components, they will still be included in the bundle. You could manually exclude them from the globbing pattern, but that would never be in sync with the imports to the components, potentially risking missing out on styles for your pages.</p></li></ol><p><strong>Currently, option 2 is implemented in this skeleton.</strong> :::</p><h3 id="supporting-files" tabindex="-1">Supporting files <a class="header-anchor" href="#supporting-files" aria-hidden="true">#</a></h3><h4 id="stories" tabindex="-1">Stories <a class="header-anchor" href="#stories" aria-hidden="true">#</a></h4><p>Muban has its own storybook framework, which is included by default in this skeleton.</p><p>The story file uses <code>PascalCase</code>, mimicking the TypeScript component, with a <code>.stories</code> suffix.</p><div class="language-ts"><pre><code><span class="token comment">// MyComponent.stories.ts</span>

<span class="token keyword">import</span> <span class="token keyword">type</span> <span class="token punctuation">{</span> Story <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@muban/storybook&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token keyword">type</span> <span class="token punctuation">{</span> MyComponentTemplateProps <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./MyComponent.template&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> MyComponent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./MyComponent&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> myComponentTemplate <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./MyComponent.template&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  title<span class="token operator">:</span> <span class="token string">&#39;MyComponent&#39;</span><span class="token punctuation">,</span>
  argTypes<span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token comment">// Configure your props</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> Default<span class="token operator">:</span> Story<span class="token operator">&lt;</span>ButtonTemplateProps<span class="token operator">&gt;</span> <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span>
      component<span class="token operator">:</span> MyComponent<span class="token punctuation">,</span>
      template<span class="token operator">:</span> myComponentTemplate<span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  args<span class="token operator">:</span> <span class="token punctuation">{</span>
    prop1<span class="token operator">:</span> <span class="token string">&#39;hello&#39;</span><span class="token punctuation">,</span>
    prop2<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    childProp<span class="token operator">:</span> <span class="token string">&#39;awesome&#39;</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre></div></div>`,42),p=[o];function c(i,l,r,u,d,m){return t(),s("div",null,p)}var y=n(e,[["render",c]]);export{h as __pageData,y as default};
