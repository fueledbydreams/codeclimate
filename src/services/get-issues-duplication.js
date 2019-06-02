const { get } = require('axios');

const { CODE_CLIMATE_URL } = require('../constants');

module.exports = async (repoId, snapshotId) => get(`${CODE_CLIMATE_URL}/${repoId}/snapshots/${snapshotId}/issues?filter%5Bstatus%5D=open&filter%5Bstatus%5D=confirmed&filter%5Bcategories%5D=Duplication`);
