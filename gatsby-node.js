exports.modifyWebpackConfig = ({ config, stage }) => {
  if (stage === 'build-html') {
    config.loader('null', {
      test: /hammerjs|react-beforeunload/,
      loader: 'null-loader',
    });
  }
};