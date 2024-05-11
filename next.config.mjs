/* eslint-disable no-param-reassign */
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkUnwrapImages from 'remark-unwrap-images';
import createMDX from '@next/mdx';
import './src/lib/Env.mjs';
// eslint-disable-next-line import/no-extraneous-dependencies
import withBundleAnalyzer from '@next/bundle-analyzer';
// import withNextIntl from 'next-intl/plugin';

// const withNextIntlConfig = withNextIntl('./src/libs/i18n.ts');

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// import { withSentryConfig } from "@sentry/nextjs";

const remarkPlugins = [
  remarkGfm,
  remarkFrontmatter,
  remarkMdxFrontmatter,
  remarkUnwrapImages,
];
// const remarkPlugins = [remarkFrontmatter, remarkMdxFrontmatter,remarkUnwrapImages ]
/** @type {import('next').NextConfig} */

const withMDX = createMDX({
  // const withMDX = require("@next/mdx")({
  extension: /\.(md|mdx)$/,
  options: {
    providerImportSource: '@mdx-js/react',
    remarkPlugins,
  },
});

const nextConfig = {
  pageExtensions: ['js', 'ts', 'jsx', 'mdx', 'tsx'],
  transpilePackages: ['@mdxeditor/editor', 'react-diff-view'],
  swcMinify: false,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // Related to Pino error with RSC: https://github.com/orgs/vercel/discussions/3150
    serverComponentsExternalPackages: ['pino', 'pino-pretty'],
  },
  images: {
    // limit of 25 deviceSizes values
    // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // limit of 25 imageSizes values
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // limit of 50 domains values
    domains: ['localhost'], // path prefix for Image Optimization API, useful with `loader`
    // path: '/_next/image',
    // loader can be 'default', 'imgix', 'cloudinary', 'akamai', or 'custom'
    loader: 'default',
    // loaderFile: './components/utils/nextImageLoader.js',
    // file with `export default function loader({src, width, quality})`
    // loaderFile: '',
    // disable static imports for image files
    disableStaticImages: false,
    // minimumCacheTTL is in seconds, must be integer 0 or more
    minimumCacheTTL: 60,
    // ordered list of acceptable optimized image formats (mime types)
    // formats: ['image/webp'],
    // enable dangerous use of SVG images
    dangerouslyAllowSVG: false,
    // set the Content-Security-Policy header
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // sets the Content-Disposition header (inline or attachment)
    // contentDispositionType: 'inline',
    // limit of 50 objects
    // remotePatterns: [],
    // when true, every image will be unoptimized
    unoptimized: false,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, dns: false };
    // config.externals is needed to resolve the following errors:
    // Module not found: Can't resolve 'bufferutil'
    // Module not found: Can't resolve 'utf-8-validate'
    config.externals.push({
      bufferutil: 'bufferutil',
      'utf-8-validate': 'utf-8-validate',
    });
    // Add the alias configuration to the webpack config
    config.resolve.alias = {
      ...config.resolve.alias,
      // react: path.join(__dirname, 'node_modules/react'),
      // '@mui/material': path.join(__dirname, 'node_modules/@mui/material'),
      // '@emotion/react': path.join(__dirname, 'node_modules/@emotion/react'),
    };
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  // experimental: {
  //   appDir: true,
  // },
};

export default withMDX(bundleAnalyzer(nextConfig));
