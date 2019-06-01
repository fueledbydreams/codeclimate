const { htm } = require('@zeit/integration-utils');

module.exports = async ({ payload, zeitClient }) => {
  const { clientState, action } = payload;
  const store = await zeitClient.getMetadata();

  if (action === 'submit') {
    store.appID = clientState.appID;
    await zeitClient.setMetadata(store);
  }

  if (action === 'reset') {
    store.appID = '';
    await zeitClient.setMetadata(store);
  }

  return htm`
    <Container>
      <Box display="flex" justifyContent="right" flexDirection="column"  alignItems="right">
        <Container>
          <Box textAlign="center">
            <H1>Settings</H1>
          </Box>
        </Container>
        <Container>
          <Input label="App Id" name="appID" value=${store.appID || ''} />
        </Container>
        <Container>
          <Button action="submit">Submit</Button>
          <Button action="reset">Reset</Button>
        </Container>
      </Box>
    </Container>
  `;
};
