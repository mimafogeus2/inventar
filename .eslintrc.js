module.exports = {
	parser: '@typescript-eslint/parser', // Specifies the ESLint parser
	parserOptions: {
		ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
		sourceType: 'module', // Allows for the use of imports
		ecmaFeatures: {
			jsx: true, // Allows for the parsing of JSX
		},
	},
	plugins: ['@typescript-eslint', 'prettier'],
	extends: ['plugin:@typescript-eslint/recommended', 'prettier/@typescript-eslint', 'prettier'],
	rules: {
		'@typescript-eslint/explicit-module-boundary-types': 0,
		'@typescript-eslint/no-explicit-any': 0,
		'@typescript-eslint/no-empty-function': 0,
		'prettier/prettier': 'error',
	},
}
