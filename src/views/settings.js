const { htm } = require('@zeit/integration-utils');

module.exports = async () => {
  return htm`
    <Container>
      <Box display="flex" justifyContent="right" flexDirection="column"  alignItems="right">
        Add your repo to <Link href="https://codeclimate.com/dashboard">Code Climate</Link>.
        Then choose it from the dropdown above.
      </Box>
    </Container>
  `;
};
