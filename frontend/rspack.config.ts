import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import { defineConfig } from '@rspack/cli';
import { rspack, type SwcLoaderOptions } from '@rspack/core';
import { ReactRefreshRspackPlugin } from '@rspack/plugin-react-refresh';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  entry: {
    main: './src/main.tsx',
  },
  devtool: isDev ? 'eval-source-map' : 'cheap-source-map',
  target: [
    'browserslist:last 2 Chrome versions, last 2 Firefox versions, last 2 Safari versions, last 2 Edge versions, not dead',
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    conditionNames: ['import', 'module', 'browser', 'require', 'default'],
    extensions: ['...', '.ts', '.tsx', '.jsx'],
    fallback: {
      tty: false,
      util: false,
    },
  },

  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp|avif|ico|svg)$/,
        type: 'asset',
      },
      {
        test: /\.css$/,
        use: ['postcss-loader'],
        type: 'css/auto',
      },
      {
        test: /\.(?:js|jsx|mjs|cjs|ts|tsx|mts|cts)$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              detectSyntax: 'auto',
              jsc: {
                transform: {
                  react: {
                    runtime: 'automatic',
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
            } satisfies SwcLoaderOptions,
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './index.html',
    }),
    isDev && new ReactRefreshRspackPlugin(),
    isProd &&
      new RsdoctorRspackPlugin({
        disableClientServer: true,
        output: {
          reportDir: path.resolve(__dirname, 'rsdoctor-report'),
          mode: 'brief',
          options: {
            type: ['json', 'html'],
          },
        },
      }),
  ],
  output: {
    filename: isDev ? '[name].js' : '[name].[contenthash:8].js',
    chunkFilename: isDev ? '[name].js' : '[name].[contenthash:8].js',
    cssFilename: isDev ? '[name].css' : '[name].[contenthash:8].css',
    cssChunkFilename: isDev ? '[name].css' : '[name].[contenthash:8].css',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 25,
      maxAsyncRequests: 25,
      cacheGroups: {
        mantine: {
          test: /[\\/]node_modules[\\/](@mantine|mantine-react-table)[\\/]/,
          name: 'vendor-mantine',
          priority: 30,
          chunks: 'all',
        },
        genomics: {
          test: /[\\/]node_modules[\\/](gosling\.js|higlass|pixi\.js|@pixi)[\\/]/,
          name: 'vendor-genomics',
          priority: 20,
          enforce: true,
          chunks: 'async',
        },
        pdf: {
          test: /[\\/]node_modules[\\/](jspdf|html2canvas|canvg|svg-pathdata|rgbcolor|stackblur-canvas)[\\/]/,
          name: 'vendor-pdf',
          priority: 25,
          chunks: 'async',
        },
        tablerIcons: {
          test: /[\\/]node_modules[\\/]@tabler[\\/]icons-react[\\/]/,
          name: 'vendor-icons',
          priority: 35,
          enforce: true,
          chunks: 'all',
        },
        coreJs: {
          test: /[\\/]node_modules[\\/]core-js[\\/]/,
          name: 'vendor-polyfills',
          priority: 15,
          chunks: 'async',
        },
      },
    },
  },
  devServer: {
    host: 'localhost',
    hot: true,
    liveReload: true,
    historyApiFallback: true,
    port: process.env.FRONTEND_PORT
      ? parseInt(process.env.FRONTEND_PORT)
      : 8080,
    proxy: [
      {
        context: ['/api', '/health'],
        target: process.env.BACKEND_URL ?? 'http://localhost:8000',
        changeOrigin: true,
      },
    ],
  },
});
