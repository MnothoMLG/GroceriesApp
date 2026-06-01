module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: '.env',
        },
      ],
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@components': './src/components',
            '@config': './src/config',
            '@navigation': './src/navigation',
            '@theme': './src/theme',
            '@store': './src/store',
            '@screens': './src/screens',
            '@assets': './src/assets',
            '@util': './src/util',
            '@constants': './src/constants',
            '@api': './src/api',
            '@hooks': './src/hooks',
          },
        },
      ],
    ],
  };
};
