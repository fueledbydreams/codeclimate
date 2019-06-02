const { htm } = require('@zeit/integration-utils');

module.exports = async () => {
  return htm`
    <Container>
      <Box display="flex" justifyContent="right" flexDirection="column"  alignItems="right">
        Setup Info Here

        <Container>
          <Button action="foo">Submit</Button>
        </Container>
      </Box>
    </Container>
  `;
};
