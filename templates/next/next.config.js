/**
 * @type {import('next').NextConfig}
 */
const NEXT_CONFIG = {
  reactStrictMode: true,
  eslint: {
    dirs: ['pages', 'components', 'theme', 'storybook-helpers'],
  },
  compiler: {
    styledComponents: true,
  },
};

export default NEXT_CONFIG;
