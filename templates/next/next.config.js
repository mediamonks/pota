import withPlugins from 'next-compose-plugins';
import optimizedImages from 'next-optimized-images';

/**
 * @type {import('next').NextConfig}
 */
const NEXT_CONFIG = {
  reactStrictMode: true,
  eslint: {
    dirs: ['src'],
  },
  compiler: {
    styledComponents: true,
  },
};

export default withPlugins([[optimizedImages]], NEXT_CONFIG);
