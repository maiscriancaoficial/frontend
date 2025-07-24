import type { NextConfig } from "next";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { dev, isServer }) => {
    // Adiciona o plugin MiniCssExtractPlugin à configuração
    config.plugins = config.plugins || [];
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash].css',
        chunkFilename: 'static/css/[name].[contenthash].css',
      })
    );

    // Ajusta regras de CSS
    const cssRules = config.module.rules
      .find((rule) => typeof rule === 'object' && rule.oneOf)?.oneOf
      ?.filter((rule) => 
        rule.sideEffects === false && 
        rule.use && 
        typeof rule.use === 'object' && 
        typeof rule.use.loader === 'string' && 
        /\/css-loader\//.test(rule.use.loader)
      );

    if (cssRules) {
      cssRules.forEach((rule) => {
        if (rule.use && typeof rule.use === 'object') {
          rule.use = [
            MiniCssExtractPlugin.loader,
            rule.use,
          ];
        }
      });
    }

    return config;
  },
};

export default nextConfig;
