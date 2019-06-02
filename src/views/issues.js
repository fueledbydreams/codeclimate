const { htm } = require('@zeit/integration-utils');

const getIssues = require('../services/get-issues');
const getRepository = require('../services/get-repository');

const getGithubBranch = require('../selectors/get-github-branch');
const getGithubFilePath = require('../selectors/get-github-file-path');
const getGithubRepo = require('../selectors/get-github-repo');
const getIssuesSelector = require('../selectors/get-issues');
const getSnapshotId = require('../selectors/get-snapshot-id');

const getSeverityColor = require('../utilities/get-severity-color');

module.exports = async ({ payload, zeitClient }) => {
  const store = await zeitClient.getMetadata();
  let repoInfo;
  let issues;

  if (store.appID) {
    repoInfo = await getRepository(store.appID);
    const snapshotId = getSnapshotId(repoInfo);
    const issuesResponse = await getIssues(store.appID, snapshotId);
    issues = getIssuesSelector(issuesResponse);
  }

  const githubRepo = getGithubRepo(repoInfo);
  const githubBranch = getGithubBranch(repoInfo);

  return htm`
    <Container>
        ${issues.map(
          (issue) => htm`
              <Box marginBottom="20px">
                <Box fontSize="18px" display="flex">
                  <Box width="10px" height="10px" borderRadius="50%" 
                       backgroundColor="${getSeverityColor(issue.attributes.severity)}" marginTop="7px" marginRight="10px"></Box>  
                  <Box>${issue.attributes.description}</Box>  
                </Box>
                <Box fontSize="12px" paddingLeft="2rem" color="#7f7f7f">
                  Found at: <Link href="${getGithubFilePath(githubRepo, githubBranch, issue)}">
                    ${issue.attributes.location.path}
                  </Link>
                </Box>
              </Box>
            `
        )}
    </Container>
  `;
};
