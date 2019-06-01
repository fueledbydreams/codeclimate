const { htm } = require('@zeit/integration-utils');

module.exports = async (page, payload, zeitClient) => {
  const { action } = payload;

  return htm`
    <Page>
    <Box textAlign="center">
        <Button action="overview" abort small>${(action === 'overview') ? htm`<B>Overview</B>` : 'Overview'}</Button>
        <Button action="progress" abort small>${(action === 'progress') ? htm`<B>Progress</B>` : 'Progress'}</Button>
        <Button action="issues" abort small>${(action === 'issues') ? htm`<B>Issues</B>` : 'Issues'}</Button>
        <Button action="code" abort small>${(action === 'code') ? htm`<B>Code</B>` : 'Code'}</Button>
        <Button action="trends" abort small>${(action === 'trends') ? htm`<B>Trends</B>` : 'Trends'}</Button>
        <Button action="settings" abort small>${(action === 'settings') ? htm`<B>Settings</B>` : 'Settings'}</Button>
    </Box>
    ${await page({ payload, zeitClient })}
    </Page>
  `;
}
