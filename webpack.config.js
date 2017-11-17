switch (process.env.ENV) {
	case 'prod':
	case 'production':
		module.exports = require('./config/webpack.prod')({ env: 'prod' });
		break;
	case 'test':
		module.exports = require('./config/webpack.prod')({ env: 'prod' });
		break;
	case 'dev':
	case 'development':
	default:
		module.exports = require('./config/webpack.dev')({ env: 'dev' });
}