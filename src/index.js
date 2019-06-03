const { withUiHook } = require('@zeit/integration-utils');

const getGitHubInfo = require('./services/get-github-info');
const getRepositoryByGithubSlug = require('./services/get-repository-by-github-slug');

const getGitHubOrgName = require('./selectors/get-github-org-name');
const getGitHubRepoName = require('./selectors/get-github-repo-name');

const issues = require('./views/issues');
const overview = require('./views/overview');
const settings = require('./views/settings');
const withPage = require('./views/with-page');

module.exports = withUiHook(async ({ payload, zeitClient }) => {
  const { action } = payload;

  let githubSlug;
  let repoInfo;

  if (payload.projectId) {
    const deployments = await getGitHubInfo(payload.projectId, payload.token);
    const ghOrg = getGitHubOrgName(deployments.data);
    const ghRepo = getGitHubRepoName(deployments.data);
    githubSlug = `${ghOrg}/${ghRepo}`;
  }

  if (githubSlug) {
    repoInfo = await getRepositoryByGithubSlug(githubSlug);
  }

  let [actionName, requestedIssuesPage] = action.split('-');

  switch (actionName) {
    case 'overview': {
      if (repoInfo && repoInfo.data.data.length > 0) {
        return withPage(overview, payload, zeitClient, repoInfo.data);
      } else {
        return withPage(settings, payload, zeitClient);
      }
    }
    case 'issues': {
      if (repoInfo && repoInfo.data.data.length > 0) {
        return withPage(issues, payload, zeitClient, repoInfo.data, { requestedIssuesPage });
      } else {
        return withPage(settings, payload, zeitClient);
      }
    }
    case 'settings': {
      return withPage(settings, payload, zeitClient);
    }
    default: {
      if (repoInfo && repoInfo.data.data.length > 0) {
        payload.action = 'overview';
        return withPage(overview, payload, zeitClient, repoInfo.data);
      } else {
        payload.action = 'settings';
        return withPage(settings, payload, zeitClient);
      }
    }
  }
});
