import withPlugins from 'next-compose-plugins';
import optimizedImages from 'next-optimized-images';

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

export default withPlugins([[optimizedImages]], NEXT_CONFIG);
