const tslint = require('@forgleaner/eslint-config/ts');
const vue = require('@forgleaner/eslint-config/vue');
module.exports = {
  extends: '@forgleaner/eslint-config',
  overrides: [
    tslint,
    vue
  ],
  rules:{
    'spaced-comment': 'off'
  }
};
