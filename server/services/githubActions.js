'use strict';

const fsPromises = require('fs').promises;
const buildPluginConfig = require('../utils/buildPluginConfig');
const axios = require('axios').default;
let privateKey = ""

async function githubAppAuth() {
  const config = buildPluginConfig(strapi);
  if (!privateKey) {
    privateKey = await fsPromises.readFile(config.githubAppPrivateKey, 'utf8');
  }
  const octokit = await import("@octokit/auth-app");
  const appAuth = octokit.createAppAuth({
    appId: config.githubAppID,
    privateKey: privateKey,
  });
  const installationAuth = await appAuth({
    type: "installation",
    installationId: config.githubAppInstallationID
  });
  return await installationAuth.token;
}


async function history() {
  const config = buildPluginConfig(strapi);
  try {
    let authorization = ""
    if (config.githubAppID == "") {
      authorization = `token ${config.githubToken}`
    } else {
      let token = await githubAppAuth()
      authorization = `Bearer ${token}`
    }
    const res = await axios.get(
      `https://api.github.com/repos/${config.owner}/${config.repo}/actions/workflows/${config.workflowId}/runs?per_page=20&page=1&branch=${config.branch}`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: authorization,
        },
      }
    );
    return res;
  } catch (err) {
    console.log(err);
  }
}

async function trigger() {
  const config = buildPluginConfig(strapi);
  try {
    let authorization = ""
    if (config.githubAppID == "") {
      authorization = `token ${config.githubToken}`
    } else {
      let token = await githubAppAuth()
      authorization = `Bearer ${token}`
    }
    const res = await axios.post(
      `https://api.github.com/repos/${config.owner}/${config.repo}/actions/workflows/${config.workflowId}/dispatches`,
      {
        ref: config.branch,
        inputs: {},
      },
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: authorization,
        },
      }
    );
    return res;
  } catch (err) {
    return {
      status: err.response.status,
      statusText: err.response.statusText,
    };
  }
}

async function getLogs(jobId) {
  const config = buildPluginConfig(strapi);
  try {
    let authorization = ""
    if (config.githubAppID == "") {
      authorization = `token ${config.githubToken}`
    } else {
      let token = await githubAppAuth()
      authorization = `Bearer ${token}`
    }
    const res = await axios.get(
      `https://api.github.com/repos/${config.owner}/${config.repo}/actions/runs/${jobId}/logs`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: authorization,
        },
      }
    );
    return res.request.res.responseUrl;
  } catch (err) {
    console.log(err);
    return {
      status: err.response.status,
      statusText: err.response.statusText,
    };
  }
}

module.exports = {
  history,
  trigger,
  getLogs,
};
