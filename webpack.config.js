// ENV decides whether to optimize/uglify or not.
switch (process.env.ENV) {
	case 'prod':
	case 'production':
		module.exports = require('./config/webpack.prod')({ env: 'prod' });
		break;
	case 'analyze':
		module.exports = require('./config/webpack.analyze')({ env: 'prod' });
		break;
	case 'dev':
	case 'development':
	default:
		module.exports = require('./config/webpack.dev')({ env: 'dev' });
}