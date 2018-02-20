const fs = require('fs');
const config = './config/webpack.' + process.env.ENV + '.js';
if (!fs.existsSync(config)) {
	throw Error('The ENV variable points to your webpack config. ' + config + ' does not exist.');
}
module.exports = require(config)({ env: process.env.ENV });
