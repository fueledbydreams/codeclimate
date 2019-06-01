const { htm } = require('@zeit/integration-utils');

module.exports = async ({ payload, zeitClient }) => {
  return htm`
    <Container>
      <Box display="flex" justifyContent="right" flexDirection="column"  alignItems="right">
        <Container>
          <Box textAlign="center">
            <H1>Code</H1>
          </Box>
        </Container>
        <Container>
        </Container>
      </Box>
    </Container>
  `;
}
