const { get } = require('axios');

const { CODE_CLIMATE_URL } = require('../constants');

module.exports = async (repoId) => get(`${CODE_CLIMATE_URL}/${repoId}/test_reports`);
