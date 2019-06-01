const { withUiHook } = require('@zeit/integration-utils');

const code = require('./views/code');
const issues = require('./views/issues');
const overview = require('./views/overview');
const progress = require('./views/progress');
const settings = require('./views/settings');
const trends = require('./views/trends');
const withPage = require('./views/with-page');

module.exports = withUiHook(async ({ payload, zeitClient }) => {
  const { action } = payload;
  const store = await zeitClient.getMetadata();

  switch (action) {
    case 'overview': {
      return withPage(overview, payload, zeitClient);
    }
    case 'progress': {
      return withPage(progress, payload, zeitClient);
    }
    case 'issues': {
      return withPage(issues, payload, zeitClient);
    }
    case 'code': {
      return withPage(code, payload, zeitClient);
    }
    case 'trends': {
      return withPage(trends, payload, zeitClient);
    }
    case 'settings': {
      return withPage(settings, payload, zeitClient);
    }
    default: {
      if (store.appID && store.appID.length > 0) {
        payload.action = 'overview';
        return withPage(overview, payload, zeitClient);
      } else {
        payload.action = 'settings';
        return withPage(settings, payload, zeitClient);
      }
    }
  }
});
