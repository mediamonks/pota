import { defineConfig, DefaultTheme } from 'vitepress';

const ALL_COMBINATIONS_SIDEBAR_ITEM: DefaultTheme.SideBarItem = {
  text: 'All Combinations',
  link: '/combinations/',
}


const VANILLA_COMBINATION_SIDEBAR: DefaultTheme.SideBarConfig = [
  ALL_COMBINATIONS_SIDEBAR_ITEM,
  {
    text: "vanilla",
    link: '/combinations/vanilla/',
  }
]

const MUBAN_COMBINATION_SIDEBAR: DefaultTheme.SideBarConfig = [
  ALL_COMBINATIONS_SIDEBAR_ITEM,
  {
    text: "muban",
    link: '/combinations/muban/',
    children: [
      { text: 'Assets', link: '/combinations/muban/assets' },
      { text: 'Components', link: '/combinations/muban/components' },
      { text: 'Folder Structure', link: '/combinations/muban/folder_structure' },
      { text: 'Pages', link: '/combinations/muban/pages' },
      { text: 'Scripts', link: '/combinations/muban/scripts' },
    ]
  }
]

const REACT_COMBINATION_SIDEBAR: DefaultTheme.SideBarConfig = [
  ALL_COMBINATIONS_SIDEBAR_ITEM,
  {
    text: "react",
    link: '/combinations/react/',
  }
]

const REACT_BASE_COMBINATION_SIDEBAR: DefaultTheme.SideBarConfig = [
  ALL_COMBINATIONS_SIDEBAR_ITEM,
  {
    text: "react-base",
    link: '/combinations/react-base/',
  }
]

const NEXT_COMBINATION_SIDEBAR: DefaultTheme.SideBarConfig = [
  ALL_COMBINATIONS_SIDEBAR_ITEM,
  {
    text: "next",
    link: '/combinations/next/',
  }
]


const SIDEBAR: DefaultTheme.SideBarConfig = [
  {
    text: 'Combinations',
    link: '/combinations/',
    children: [
      { text: 'vanilla', link: '/combinations/vanilla/' },
      { text: 'muban', link: '/combinations/muban/' },
      { text: 'react', link: '/combinations/react/' },
      { text: 'react-base', link: '/combinations/react-base/' },
      { text: 'next', link: '/combinations/next/' }
    ],
  },

  {
    text: 'Templates',
    link: '/templates/',
    children: [
      { text: 'vanilla', link: '/templates/vanilla' },
      { text: 'muban', link: '/templates/muban' },
      { text: 'react', link: '/templates/react' },
      { text: 'react-base', link: '/templates/react-base' },
      { text: 'next', link: '/templates/next' },
    ],
  },

  {
    text: 'Scripts',
    link: '/scripts/',
    children: [
      { text: 'webpack', link: '/scripts/webpack' },
      { text: 'react-webpack', link: '/scripts/react-webpack' },
      { text: 'muban-webpack', link: '/scripts/muban-webpack' },
      { text: 'vite', link: '/scripts/vite' },
      { text: 'react-vite', link: '/scripts/react-vite' },
    ],
  },
];

export default defineConfig({
  lang: 'en-US',
  title: 'Pota',
  description: 'Pota documentation',
  lastUpdated: true,
  base: '/pota/',

  themeConfig: {
    repo: 'mediamonks/pota',
    docsDir: 'docs',
    docsBranch: 'main',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',

    nav: [
      { text: 'Combinations', link: '/combinations/', activeMatch: '^/combinations/' },
      { text: 'Templates', link: '/templates/', activeMatch: '^/templates/' },
      { text: 'Scripts', link: '/scripts/', activeMatch: '^/scripts/' },
    ],

    sidebar: {
      '/combinations/vanilla': VANILLA_COMBINATION_SIDEBAR,
      '/combinations/muban': MUBAN_COMBINATION_SIDEBAR,
      '/combinations/react-base': REACT_BASE_COMBINATION_SIDEBAR,
      '/combinations/react': REACT_COMBINATION_SIDEBAR,
      '/combinations/next': NEXT_COMBINATION_SIDEBAR,
      '/': SIDEBAR,
    },
  },
});
