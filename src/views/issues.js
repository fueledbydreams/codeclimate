const { htm } = require('@zeit/integration-utils');

const getIssues = require('../services/get-issues');
const getIssuesByNextPage = require('../services/get-issues-by-next-page');

const getGithubBranch = require('../selectors/get-github-branch');
const getGithubFilePath = require('../selectors/get-github-file-path');
const getGithubRepo = require('../selectors/get-github-repo');
const getIssuesSelector = require('../selectors/get-issues');
const getSnapshotId = require('../selectors/get-snapshot-id');
const getCodeClimateId = require('../selectors/get-code-climate-id');
const getIssuesNextPage = require('../selectors/get-issues-next-page');

const getSeverityColor = require('../utilities/get-severity-color');

let nextPage = '';

module.exports = async ({ repoInfo }) => {
  let issues;

  const repoID = getCodeClimateId(repoInfo);
  const snapshotId = getSnapshotId(repoInfo);
  let issuesResponse;

  if (nextPage === '') {
    issuesResponse = await getIssues(repoID, snapshotId);
  } else {
    issuesResponse = await getIssuesByNextPage(nextPage);
  }

  issues = getIssuesSelector(issuesResponse);
  nextPage = getIssuesNextPage(issuesResponse);

  const githubRepo = getGithubRepo(repoInfo);
  const githubBranch = getGithubBranch(repoInfo);

  return htm`
    <Container>
        ${
          issues.length === 0
            ? htm`
              <Box display="flex" alignItems="center" justifyContent="center">
                <Notice type="success">No issues found!</Notice>
              </Box>`
            : issues.map(
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
              )
        }
    </Container>
  `;
};
