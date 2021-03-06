const { htm } = require('@zeit/integration-utils');

const getSnapshot = require("../services/get-snapshot");
const getTestCoverageReport = require("../services/get-test-coverage-report");
const getIssuesCodeSmell = require('../services/get-issues-code-smell');
const getIssuesDuplication = require('../services/get-issues-duplication');
const getIssuesOtherIssues = require('../services/get-issues-other-issues');

const getCodeClimateId = require("../selectors/get-code-climate-id");
const getSnapshotId = require("../selectors/get-snapshot-id");
const getCodeCoverage = require("../selectors/get-code-coverage");
const getCodeCoverageRating = require("../selectors/get-code-coverage-rating");
const getSnapshotRating = require("../selectors/get-snapshot-rating");
const getGitHubSlugFromRepoInfo = require("../selectors/get-github-slug-from-repo-info");
const getLinesOfCode = require("../selectors/get-lines-of-code");
const getIssueCount = require("../selectors/get-issue-count");

const getColor = require("../utilities/get-color");

module.exports = async ({ repoInfo }) => {
  const repoID = getCodeClimateId(repoInfo);
  const testCoverageReport = await getTestCoverageReport(repoID);

  let codeCoverage = 0;
  let codeCoverageRating = 'F';
  let codeCoverageColor = getColor(codeCoverageRating);

  if (testCoverageReport.data.length > 0) {
    codeCoverage = getCodeCoverage(testCoverageReport.data);
    codeCoverageRating = getCodeCoverageRating(testCoverageReport.data);
    codeCoverageColor = getColor(codeCoverageRating);
  }

  const snapshotId = getSnapshotId(repoInfo);
  const ghSlug = getGitHubSlugFromRepoInfo(repoInfo);
  const snapshot = await getSnapshot(repoID, snapshotId);
  const issuesCodeSmell = await getIssuesCodeSmell(repoID, snapshotId);
  const codeSmellCount = getIssueCount(issuesCodeSmell);
  const issuesDuplication = await getIssuesDuplication(repoID, snapshotId);
  const duplicationCount = getIssueCount(issuesDuplication);
  const issuesOtherIssues = await getIssuesOtherIssues(repoID, snapshotId);
  const issuesOtherCount = getIssueCount(issuesOtherIssues);
  const linesOfCode = getLinesOfCode(snapshot.data);
  const snapshotRating = getSnapshotRating(snapshot.data);
  const snapshotColor = getColor(snapshotRating);

  return htm`
    <Container>
      <Box display="flex" flexDirection="row">
        <Box flexBasis="40%">
          <Box marginBottom="20px" fontSize="30px" lineHeight="40px">Breakdown</Box>
          <H2>${linesOfCode} Lines of code</H2>
          <Box backgroundColor="#f7f7f7" display="inline-block" height="10px" width="100%">
            <Box width="100%" backgroundColor=${snapshotColor} float="left" height="100%" position="relative"/>
          </Box>
          <H2>Maintainability</H2>
          <Box backgroundColor="#f7f7f7" display="inline-block" height="10px" width="100%">
            <Box width="100%" backgroundColor=${codeCoverageColor} float="left" height="100%" position="relative"/>
          </Box>
          <H2>Test coverage</H2>
        </Box>
        <Box flexBasis="60%" marginLeft="120px">
          <Box marginBottom="20px" fontSize="30px" lineHeight="40px">Codebase Summary</Box>
          <Box display="flex" flexDirection="row" flexWrap="wrap" marginBottom="30px">
            <Box flexBasis="33.33333333%" margin="0 0 0.6rem" padding="0">
              <Box>
                <Box color="#7f7f7f" fontSize="12px" letterSpacing=".2em" lineHeight="20px" textTransform="uppercase">Maintainability</Box>
                <Box backgroundColor=${snapshotColor} fontSize="40px" height="60px" paddingTop="12px" width="60px" borderRadius="3px" color="#ffffff" display="inline-block" fontWeight="700" lineHeight="1" position="relative" text-align="center" vertical-align="middle">${snapshotRating}</Box>
                <Box fontSize="25px" color="#656565" display="inline-block" lineHeight="1" marginLeft="12px" position="relative" verticalAlign="middle">2 days</Box>
              </Box>
            </Box>
            <Box flexBasis="33.33333333%" margin="0 0 0.6rem" padding="0 0.6rem">
              <Box>
                <Box color="#7f7f7f" fontSize="12px" letterSpacing=".2em" lineHeight="20px" textTransform="uppercase">Test coverage</Box>
                <Box backgroundColor=${codeCoverageColor} fontSize="40px" height="60px" paddingTop="12px" width="60px" borderRadius="3px" color="#ffffff" display="inline-block" fontWeight="700" lineHeight="1" position="relative" text-align="center" vertical-align="middle">${codeCoverageRating}</Box>
                <Box fontSize="25px" color="#656565" display="inline-block" lineHeight="1" marginLeft="12px" position="relative" verticalAlign="middle">${codeCoverage}%</Box>
              </Box>
            </Box>
          </Box>
          <Box paddingTop="10px" marginBottom="20px" fontSize="20px" fontWeight="300" lineHeight="30px">Repository stats</Box>
          <Box margin="0 -0.6rem" flexWrap="wrap" display="flex" flexDirection="row">
            <Box flexBasis="33.33333333%" margin="0 0 0.6rem" padding="0 0.6rem">
              <Box color="#7f7f7f" fontSize="40px" fontWeight="300" lineHeight="1">
                <Box color="#7f7f7f" fontSize="12px" letterSpacing=".2em" lineHeight="20px" textTransform="uppercase">Code Smells</Box>
                <Link href=${`https://codeclimate.com/github/${ghSlug}/issues?category=complexity&amp;engine_name%5B%5D=structure&amp;engine_name%5B%5D=duplication`}>${codeSmellCount}</Link>              
              </Box>
            </Box>          
            <Box flexBasis="33.33333333%" margin="0 0 0.6rem" padding="0 0.6rem">
              <Box color="#7f7f7f" fontSize="40px" fontWeight="300" lineHeight="1">
                <Box color="#7f7f7f" fontSize="12px" letterSpacing=".2em" lineHeight="20px" textTransform="uppercase">Duplication</Box>
                <Link href=${`https://codeclimate.com/github/${ghSlug}/issues?category=duplication&engine_name%5B%5D=structure&engine_name%5B%5D=duplication`}>${duplicationCount}</Link>              
              </Box>
            </Box>          
            <Box flexBasis="33.33333333%" margin="0 0 0.6rem" padding="0 0.6rem">
              <Box color="#7f7f7f" fontSize="40px" fontWeight="300" lineHeight="1">
                <Box color="#7f7f7f" fontSize="12px" letterSpacing=".2em" lineHeight="20px" textTransform="uppercase">Other Issues</Box>
                <Link href=${`https://codeclimate.com/github/${ghSlug}/issues`}>${issuesOtherCount}</Link>              
              </Box>
            </Box>          
          </Box>
        </Box>
      </Box>
    </Container>
  `;
};
