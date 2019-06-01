const { withUiHook, htm } = require('@zeit/integration-utils');

const getRepository = require("./services/get-repository");
const getSnapshot = require("./services/get-snapshot");
const getTestCoverageReport = require("./services/get-test-coverage-report");

const getSnapshotId = require("./selectors/get-snapshot-id");
const getCodeCoverage = require("./selectors/get-code-coverage");
const getCodeCoverageRating = require("./selectors/get-code-coverage-rating");
const getSnapshotRating = require("./selectors/get-snapshot-rating");

const getColor = require("./utilities/get-color");
module.exports = withUiHook(async ({ payload, zeitClient }) => {
  const { clientState, action } = payload;
  const store = await zeitClient.getMetadata();
  let repoInfo;

  if (action === 'submit') {
    store.appID = clientState.appID;
    store.gitRepo = clientState.gitRepo;
    await zeitClient.setMetadata(store);
  }

  if (action === 'reset') {
    store.appID = '';
    store.gitRepo = '';
    await zeitClient.setMetadata(store);
  }

  if (store.appID) {
    repoInfo = await getRepository(store.appID);
  }

  const testCoverageReport = await getTestCoverageReport(store.appID);
  const codeCoverage = getCodeCoverage(testCoverageReport.data);
  const codeCoverageRating = getCodeCoverageRating(testCoverageReport.data);
  const codeCoverageColor = getColor(codeCoverageRating);

  const snapshotId = getSnapshotId(repoInfo);
  const snapshot = await getSnapshot(store.appID, snapshotId);
  const snapshotRating = getSnapshotRating(snapshot.data);
  const snapshotColor = getColor(snapshotRating);

  return htm`
		<Page>
			<Container>
				<Input label="App Id" name="appID" value=${store.appID || ''} />
				<Input label="Git Repo" name="gitRepo" value=${store.gitRepo || ''} />
			</Container>
		  <Container>
				<Button action="submit">Submit</Button>
				<Button action="reset">Reset</Button>
			</Container>
			
			<P>A paragraph.</P>
      <H1>The Title</H1>
      <H2>The Secondary Title</H2>
      <B>Some Bold Text</B>

      <Fieldset>
        <FsContent>
          <H2>This is the Title</H2>
          <P>This is some content.</P>
        </FsContent>
        <FsFooter>
          <P>This is the footer.</P>
        </FsFooter>
      </Fieldset>
    
      <Container>
        <Box display="flex">
            <Box flex="100px">
                <H1>Breakdown</H1>
                <Box>
                    32 Files
                </Box>
                <Box>
                    <Box>
                      <Box class="breakdown__rect breakdown__rect--grade-a" style="width: 72.72727272727273%"></Box>
                      <Box class="breakdown__rect breakdown__rect--grade-b" style="width: 18.181818181818183%"></Box>
                      <Box class="breakdown__rect breakdown__rect--grade-c" style="width: 9.090909090909092%"></Box>
                      <Box class="breakdown__rect breakdown__rect--grade-d" style="width: 0.0%"></Box>
                      <Box class="breakdown__rect breakdown__rect--grade-f" style="width: 0.0%"></Box>
                    </Box>
                    <H2>Maintainability</H2>
                    <Box class="breakdown">
                      <Box class="breakdown__rect breakdown__rect--grade-a" style="width: 100.0%"></Box>
                      <Box class="breakdown__rect breakdown__rect--grade-b" style="width: 0.0%"></Box>
                      <Box class="breakdown__rect breakdown__rect--grade-c" style="width: 0.0%"></Box>
                      <Box class="breakdown__rect breakdown__rect--grade-d" style="width: 0.0%"></Box>
                      <Box class="breakdown__rect breakdown__rect--grade-f" style="width: 0.0%"></Box>
                    </Box>
                    <H2>Test coverage</H2>
                </Box>
            </Box>
            <Box>
                <H1>Codebase summary</H1>
                <Box display="flex">
                    <Box>
                        <Box>
                            <H2>Maintainability</H2>
                            <Box backgroundColor=${snapshotColor}>
                                <P>${snapshotRating}</P>
                            </Box>
                            <Box>
                                <P>2 days</P>
                            </Box>
                        </Box>
                    </Box>
                    <Box>
                          <Box>
                              <H2>Test coverage</H2>
                              <Box backgroundColor=${codeCoverageColor}>
                                  <P>${codeCoverageRating}</P>
                              </Box>
                          </Box>  
                          <Box>
                              <P>${codeCoverage}</P>
                          </Box>
                        </Box>
                    </Box>
                </Box>
                <H1>Repository stats</H1>
                <Box display="flex">
                    <Box>
                        <Box>
                            <H2>Code Smells</H2>
                            <Link href="https://codeclimate.com/github/jameswlane/jest-express/issues?category=complexity&amp;engine_name%5B%5D=structure&amp;engine_name%5B%5D=duplication">11</Link>
                        </Box>
                    </Box>
                    <Box>
                        <Box>
                            <H2>Duplication</H2>
                            <Link href="https://codeclimate.com/github/jameswlane/jest-express/issues?category=duplication&amp;engine_name%5B%5D=structure&amp;engine_name%5B%5D=duplication">0</Link>
                        </Box>
                    </Box>
                    <Box>
                        <Box>
                            <H2>Other Issues</H2>125
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
			</Container>
		</Page>
	`
});
