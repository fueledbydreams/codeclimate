const { htm } = require('@zeit/integration-utils');

const getSnapshot = require("../services/get-snapshot");
const getTestCoverageReport = require("../services/get-test-coverage-report");

const getCodeClimateId = require("../selectors/get-code-climate-id");
const getSnapshotId = require("../selectors/get-snapshot-id");
const getCodeCoverage = require("../selectors/get-code-coverage");
const getCodeCoverageRating = require("../selectors/get-code-coverage-rating");
const getSnapshotRating = require("../selectors/get-snapshot-rating");
const getGitHubSlugFromRepoInfo = require("../selectors/get-github-slug-from-repo-info");

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
  const snapshotRating = getSnapshotRating(snapshot.data);
  const snapshotColor = getColor(snapshotRating);

  return htm`
    <Container>
      <Box display="flex" flexDirection="row">
        <Box flexBasis="40%">
          <Box marginBottom="20px" fontSize="30px" lineHeight="40px">Breakdown</Box>
          <H2>32 Files</H2>
          <Box backgroundColor="#f7f7f7" display="inline-block" height="10px" width="100%">
            <Box width="20%" backgroundColor="#45d298" float="left" height="100%" position="relative"/>
            <Box width="20%" backgroundColor="#a5d86e" float="left" height="100%" position="relative"/>
            <Box width="20%" backgroundColor="#f1ce0c" float="left" height="100%" position="relative"/>
            <Box width="20%" backgroundColor="#f29141" float="left" height="100%" position="relative"/>
            <Box width="20%" backgroundColor="#df5869" float="left" height="100%" position="relative"/>
          </Box>
          <H2>Maintainability</H2>
          <Box backgroundColor="#f7f7f7" display="inline-block" height="10px" width="100%">
            <Box width="20%" backgroundColor="#45d298" float="left" height="100%" position="relative"/>
            <Box width="20%" backgroundColor="#a5d86e" float="left" height="100%" position="relative"/>
            <Box width="20%" backgroundColor="#f1ce0c" float="left" height="100%" position="relative"/>
            <Box width="20%" backgroundColor="#f29141" float="left" height="100%" position="relative"/>
            <Box width="20%" backgroundColor="#df5869" float="left" height="100%" position="relative"/>
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
                <Link href="https://codeclimate.com/github/${ghSlug}/issues?category=complexity&amp;engine_name%5B%5D=structure&amp;engine_name%5B%5D=duplication">11</Link>              
              </Box>
            </Box>          
            <Box flexBasis="33.33333333%" margin="0 0 0.6rem" padding="0 0.6rem">
              <Box color="#7f7f7f" fontSize="40px" fontWeight="300" lineHeight="1">
                <Box color="#7f7f7f" fontSize="12px" letterSpacing=".2em" lineHeight="20px" textTransform="uppercase">Duplication</Box>
                <Link href="https://codeclimate.com//github/${ghSlug}/issues?category=duplication&engine_name%5B%5D=structure&engine_name%5B%5D=duplication">0</Link>              
              </Box>
            </Box>          
            <Box flexBasis="33.33333333%" margin="0 0 0.6rem" padding="0 0.6rem">
              <Box color="#7f7f7f" fontSize="40px" fontWeight="300" lineHeight="1">
                <Box color="#7f7f7f" fontSize="12px" letterSpacing=".2em" lineHeight="20px" textTransform="uppercase">Other Issues</Box>
                <Link href="https://codeclimate.com/github/${ghSlug}/issues">125</Link>              
              </Box>
            </Box>          
          </Box>
        </Box>
      </Box>
    </Container>
  `;
};
