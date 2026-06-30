/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
          fs: false, // needed for uniswap widget
      };
    config.externals.push("pino-pretty", 'lokijs', 'encoding');

    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true 
    };

    config.module.rules.push({
      test: /\.wasm$/,
      loader: 'base64-loader',
      type: 'javascript/auto'
    });

    config.module.noParse = config.module.noParse || [];
    config.module.noParse.push(/\.wasm$/);

    return config
  },
}

module.exports = nextConfig
