const { htm } = require('@zeit/integration-utils');
module.exports = async (page, payload, zeitClient, repoInfo) => {
  const { action } = payload;

  return htm`
    <Page>
    <Box textAlign="center">
        <Button action="overview" abort small>${(action === 'overview') ? htm`<B>Overview</B>` : 'Overview'}</Button>
        <Button action="issues" abort small>${(action === 'issues') ? htm`<B>Issues</B>` : 'Issues'}</Button>
        <ProjectSwitcher />
    </Box>
    ${await page({ payload, zeitClient, repoInfo })}
    </Page>
  `;
}
