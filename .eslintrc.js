module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true
	},
	"extends": "eslint:recommended",
	parser: "babel-eslint",
	parserOptions: {
		ecmaVersion: 6,
		sourceType: "module",
		ecmaFeatures: {
			impliedStrict: false
		}
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
