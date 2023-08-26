// eslint-disable-next-line no-undef
module.exports = {
	env: {
		es6: true,
		serviceworker: true,
	},
	extends: ["eslint:recommended", "plugin:unicorn/recommended"],
	rules: {
		"unicorn/no-useless-undefined": 0,
		"unicorn/prefer-spread": 0,
		"unicorn/no-array-for-each": 0,
		"unicorn/prefer-module": 0,
		"unicorn/numeric-separators-style": 0,
		"unicorn/no-await-expression-member": 0,
	},
	globals: {
		ReadableStream: true,
		TransformStream: true,
	},
	parserOptions: {
		ecmaVersion: 2023,
	},
};