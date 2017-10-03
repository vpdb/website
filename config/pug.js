const path = require('path');
const Git = require('nodegit');

const auth = require('./auth');

const config = {
	deployment: process.env.APP_NAME || 'staging',
	environment: process.env.NODE_ENV || 'development',
//	jsFiles: assets.getJs(),
//	cssFiles: assets.getCss(),
	authStrategies: {
		local: auth.local,
		github: auth.github,
		google: auth.google,
		ipboard: auth.ipboard.map(c => { return {
			name: c.name,
			icon: c.icon,
			url: '/auth/' + c.id
		}})
	},
	gaEnabled: config.webapp.ga.enabled,
	svgDefs: config.vpdb.tmp + '/vpdb-svg/_svg-defs.svg'
};


const repoRoot = path.resolve(__dirname, '..');
Git.Repository.open(repoRoot).then(repo => {
	return repo.getCurrentBranch().then(branch => {
		return repo.getBranchCommit(branch).then(commit => {
			config.gitinfo = {
				name: branch,
				SHA: commit.sha(),
				shortSHA: commit.sha().substr(0, 7),
			}
		});
	});
}).catch(err => {
	console.warn('[git] Unable to retrieve git info from %s (%s)', repoRoot, err.message);
});

module.exports = config;