const { get } = require('axios');

const { ZEIT_NOW_V4 } = require('../constants');

module.exports = async (projectId, token) => get(`${ZEIT_NOW_V4}/deployments?projectId=${projectId}`, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  }
});
