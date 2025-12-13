/**
 * CRACO Configuration for Build Optimizations
 * Extends Create React App webpack config without ejecting
 */

const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            // Production optimizations
            if (env === 'production') {
                // Compression is handled by Netlify automatically
                // Disabling webpack compression to avoid conflicts

                /*
                // Enable Gzip compression
                webpackConfig.plugins.push(
                    new CompressionWebpackPlugin({
                        filename: '[path][base].gz',
                        algorithm: 'gzip',
                        test: /\.(js|css|html|svg)$/,
                        threshold: 10240, // Only compress files larger than 10KB
                        minRatio: 0.8,
                    })
                );

                // Enable Brotli compression (better than gzip)
                webpackConfig.plugins.push(
                    new CompressionWebpackPlugin({
                        filename: '[path][base].br',
                        algorithm: 'brotliCompress',
                        test: /\.(js|css|html|svg)$/,
                        compressionOptions: {
                            level: 11,
                        },
                        threshold: 10240,
                        minRatio: 0.8,
                    })
                );
                */

                // Bundle analyzer (only when ANALYZE=true)
                if (process.env.ANALYZE === 'true') {
                    webpackConfig.plugins.push(
                        new BundleAnalyzerPlugin({
                            analyzerMode: 'static',
                            reportFilename: 'bundle-report.html',
                            openAnalyzer: true,
                        })
                    );
                }

                // Optimize chunks
                webpackConfig.optimization = {
                    ...webpackConfig.optimization,
                    splitChunks: {
                        chunks: 'all',
                        cacheGroups: {
                            // Vendor chunk for node_modules
                            vendor: {
                                test: /[\\/]node_modules[\\/]/,
                                name: 'vendors',
                                priority: 10,
                                reuseExistingChunk: true,
                            },
                            // Common chunk for shared code
                            common: {
                                minChunks: 2,
                                priority: 5,
                                reuseExistingChunk: true,
                                enforce: true,
                            },
                            // FontAwesome chunk
                            fontawesome: {
                                test: /[\\/]node_modules[\\/]@fortawesome[\\/]/,
                                name: 'fontawesome',
                                priority: 20,
                            },
                        },
                    },
                    runtimeChunk: 'single',
                };
            }

            return webpackConfig;
        },
    },

    // Babel optimizations
    babel: {
        plugins: [
            // Remove console.log in production
            process.env.NODE_ENV === 'production' && [
                'transform-remove-console',
                { exclude: ['error', 'warn'] },
            ],
        ].filter(Boolean),
    },
};
