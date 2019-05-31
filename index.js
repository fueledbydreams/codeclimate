const { withUiHook, htm } = require('@zeit/integration-utils');
const { get } = require('axios');

const GAUGE_SVG_URL = `https://svg-chart.fueledbydreams1.now.sh/pie/donut.svg`;

module.exports = withUiHook(async ({ payload, zeitClient }) => {
  const { clientState, action } = payload;
  const store = await zeitClient.getMetadata();
  let testReport;

  if (action === 'submit') {
    store.appID = clientState.appID;
    await zeitClient.setMetadata(store);
  }

  if (action === 'reset') {
    store.appID = '';
    await zeitClient.setMetadata(store);
  }

  if (store.appID) {
    const apiUrl = `https://api.codeclimate.com/v1/repos/${store.appID}/test_reports`;
    testReport = await get(apiUrl);
  }

  const codeCoverage = testReport ? testReport.data.data[0].attributes.covered_percent : 0;
  const codeRating = testReport ? testReport.data.data[0].attributes.rating.letter : 'unknown';
  let color;
  if (!codeCoverage || codeCoverage < 50) {
    color = "#c7221f";
  } else if (codeCoverage < 90) {
    color = "#e67700";
  } else {
    color = "#178239";
  }
  const gaugeSvgUrl = `${GAUGE_SVG_URL}?percent=${encodeURIComponent(codeCoverage)}`;

  return htm`
		<Page>
			<Container>
				<Input label="App Id" name="appID" value=${store.appID || ''} />
			</Container>
			<Box textAlign="center">
        <Box display="flex" justifyContent="center" alignItems="center" position="relative">
            <Img src=${gaugeSvgUrl} width="60" height="60" />
            <Box color=${color} fontSize="18px" fontWeight="bold" position="absolute">${codeCoverage || codeCoverage === 0 ? Math.floor(codeCoverage) : "?"}</Box>
        </Box>
        <P>Code Coverage</P>
        </Box>
			<Container>
				Code Rating: ${codeRating}
			</Container>
			<Container>
				<Button action="submit">Submit</Button>
				<Button action="reset">Reset</Button>
			</Container>
		</Page>
	`
});
