const { htm } = require('@zeit/integration-utils');

const getIssues = require('../services/get-issues');
const getIssuesByNextPage = require('../services/get-issues-by-next-page');

const getGithubBranch = require('../selectors/get-github-branch');
const getGithubFilePath = require('../selectors/get-github-file-path');
const getGithubRepo = require('../selectors/get-github-repo');
const getIssuesSelector = require('../selectors/get-issues');
const getIssueCount = require('../selectors/get-issue-count');
const getSnapshotId = require('../selectors/get-snapshot-id');
const getCodeClimateId = require('../selectors/get-code-climate-id');
const getIssuesPreviousPageSelector = require('../selectors/get-issues-previous-page');
const getIssuesNextPageSelector = require('../selectors/get-issues-next-page');
const getIssuesCurrentPageNumber = require('../selectors/get-issues-current-page-number');

const getSeverityColor = require('../utilities/get-severity-color');

module.exports = async ({ repoInfo, props }) => {
  let requestedIssuesPage = props.requestedIssuesPage;

  const repoID = getCodeClimateId(repoInfo);
  const snapshotId = getSnapshotId(repoInfo);
  let issuesResponse;

  if (requestedIssuesPage) {
    issuesResponse = await getIssuesByNextPage(requestedIssuesPage);
  } else {
    issuesResponse = await getIssues(repoID, snapshotId);
  }

  const issues = getIssuesSelector(issuesResponse);
  const previousPage = getIssuesPreviousPageSelector(issuesResponse);
  const nextPage = getIssuesNextPageSelector(issuesResponse);
  const issueCount = getIssueCount(issuesResponse);
  const currentPageNumber = getIssuesCurrentPageNumber(issuesResponse);
  const numberOfIssuesStart = (currentPageNumber - 1) * 30 + 1;
  const numberOfIssuesEnd = currentPageNumber * 30 > issueCount ? issueCount : currentPageNumber * 30;

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
            : htm`
              ${
                issueCount > 30
                  ? htm`
                  <Box color="#7f7f7f" marginBottom="1rem">
                    Showing ${numberOfIssuesStart}-${numberOfIssuesEnd} out of ${issueCount} total issues
                  </Box>`
                  : ''
              }
              
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
              )}`
        }
        ${previousPage ? htm`<Button action="${`issues-${previousPage}`}">Previous Page</Button>` : ''}
        ${nextPage ? htm`<Button action="${`issues-${nextPage}`}">Next Page</Button>` : ''}
    </Container>
  `;
};
