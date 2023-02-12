const withMDX = require("@next/mdx")({
  extension: /\.(md|mdx)$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "tsx"],
  experimental: {
    appDir: true,
  },
};

module.exports = withMDX(nextConfig);

