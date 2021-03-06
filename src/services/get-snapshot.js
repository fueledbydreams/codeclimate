const { get } = require('axios');

const { CODE_CLIMATE_URL } = require('../constants');

module.exports = async (repoId, snapshotId) => get(`${CODE_CLIMATE_URL}/${repoId}/snapshots/${snapshotId}`);
