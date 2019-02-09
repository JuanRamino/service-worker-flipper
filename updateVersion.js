const replace = require('replace-in-file');

const options = {
  files: `${__dirname}/public/*.js`,
  from: /(___VERSION___\s*=\s*)(\d+)/u,
  to: (...args) => `${args[1]}${parseInt(args[2]) + 1}`
};

module.exports = () => replace(options);
