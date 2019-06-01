const { get } = require('axios');

const { CODE_CLIMATE_URL } = require('../constants');

module.exports = async (githubSlug) => get(`${CODE_CLIMATE_URL}?github_slug=${githubSlug}`);
