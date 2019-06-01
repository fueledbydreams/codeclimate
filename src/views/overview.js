const { htm } = require('@zeit/integration-utils');

const getRepository = require("../services/get-repository");
const getSnapshot = require("../services/get-snapshot");
const getTestCoverageReport = require("../services/get-test-coverage-report");

const getSnapshotId = require("../selectors/get-snapshot-id");
const getCodeCoverage = require("../selectors/get-code-coverage");
const getCodeCoverageRating = require("../selectors/get-code-coverage-rating");
const getSnapshotRating = require("../selectors/get-snapshot-rating");

const getColor = require("../utilities/get-color");

module.exports = async ({ zeitClient }) => {
  const store = await zeitClient.getMetadata();
  let repoInfo;
  let testCoverageReport;

  if (store.appID) {
    repoInfo = await getRepository(store.appID);
    testCoverageReport = await getTestCoverageReport(store.appID);
  }

  const codeCoverage = getCodeCoverage(testCoverageReport.data);
  const codeCoverageRating = getCodeCoverageRating(testCoverageReport.data);
  const codeCoverageColor = getColor(codeCoverageRating);

  const snapshotId = getSnapshotId(repoInfo);
  const snapshot = await getSnapshot(store.appID, snapshotId);
  const snapshotRating = getSnapshotRating(snapshot.data);
  const snapshotColor = getColor(snapshotRating);

  return htm`
    <Container>
      <Box display="flex" justifyContent="right" flexDirection="column"  alignItems="right">
        <Container>
          <Box textAlign="center">
            <H1>Overview</H1>
          </Box>
        </Container>
        <Container>
          <P>Code Coverage: ${codeCoverage}</P>
          <P>Code Coverage Rating: ${codeCoverageRating}</P>
          <P>Code Coverage Color: ${codeCoverageColor}</P>
          <P>Snapshot Rating: ${snapshotRating}</P>
          <P>Snapshot Rating Color: ${snapshotColor}</P>
        </Container>
      </Box>
    </Container>
  `;
};
