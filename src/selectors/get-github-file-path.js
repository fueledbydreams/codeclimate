// concatenating this in a <Link> component did not work which seems like a bug (i.e. <Link href="${githubRepoUrl}/${filePath}">Click here</Link>) hence this function.
module.exports = (githubRepoUrl, branch, issue) =>
  `${githubRepoUrl}/tree/${branch}/${issue.attributes.location.path}#L${issue.attributes.location.start_line}-L${
    issue.attributes.location.end_line
  }`;
