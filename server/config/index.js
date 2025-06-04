'use strict';

module.exports = {
  default: {},
  validator({ owner, repo, branch, workflowId, githubToken, roles, githubAppID, githubInstallationID, githubAppPrivateKey }) {
    if (owner && typeof owner !== 'string') {
      throw new Error('`owner` key in yout plugin config has to be a string');
    }
    if (repo && typeof repo !== 'string') {
      throw new Error('`repo` key in your plugin config has to be a string');
    }
    if (branch && typeof branch !== 'string') {
      throw new Error('`branch` key in your plugin config has to be a string');
    }
    if (workflowId && typeof workflowId !== 'string') {
      throw new Error('`workflowId` key in your plugin workflowId has to be an string');
    }
    // At least githubToken or github app authentication must be set
    if (
      githubToken && typeof githubToken !== 'string' ||
      (
        githubAppID && typeof githubAppID !== 'string' &&
        githubInstallationID && typeof githubInstallationID !== 'string' &&
        githubAppPrivateKey && typeof githubAppPrivateKey !== 'string'
      )
    ) {
      throw new Error('either `githubToken` or `githubAppID`,`githubInstallationID`,`githubAppPrivateKey` keys in your plugin config have to be a string');
    }
    if (roles && !Array.isArray(roles)) {
      throw new Error('`roles` key in your plugin config has to be an array of strings');
    }
  },
};
