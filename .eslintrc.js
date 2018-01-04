module.exports = {
	env: {
		browser: true,
		es6: true
	},
	"extends": "eslint:recommended",
	parserOptions: {
		sourceType: "module"
	},
	rules: {
		indent: ["error", "tab", {
			SwitchCase: 1,
			FunctionDeclaration: { body: 1, parameters: 3 },
			FunctionExpression: { body: 1, parameters: 3 }
		} ],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "single"],
		semi: ["error", "always"],
		"no-console": 1
	}
};
