module.exports = {
	root: true,
	env : {
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:import/typescript',
		'plugin:promise/recommended',
		'plugin:jsonc/recommended-with-jsonc',
	],
	plugins : ['unused-imports', 'promise', 'github'],
	settings: {
		'import/resolver': {
			alias: {
				map       : [['@', './src/']],
				extensions: ['.ts', '.js'],
			},
		},
	},
	parserOptions: {
		ecmaVersion: 2021,
	},
	ignorePatterns: ['assets/*', 'dist/*'],
	rules         : {
		'jsonc/comma-dangle': ['error',
			{
				'arrays' : 'never',
				'objects': 'never',
			},
		],
		'jsonc/indent': ['error',
			'tab',
			{},
		],
		'jsonc/key-spacing': ['error',
			{
				'beforeColon': false,
				'afterColon' : true,
				'mode'       : 'strict',
			},
		],
		'jsonc/object-curly-spacing': ['error',
			'never',
		],
		'require-await'                   : 'error',
		'import/no-unresolved'            : [0, { 'caseSensitive': false }],
		'no-console'                      : process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger'                     : process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'unused-imports/no-unused-imports': 'error',
		'import/first'                    : 'error',
		'import/order'                    : [
			'error',
			{
				alphabetize       : { order: 'asc', caseInsensitive: true },
				'newlines-between': 'always',
				pathGroups        : [
					{
						pattern : '@/**',
						group   : 'external',
						position: 'after',
					},
				],
			},
		],
		// 'no-restricted-imports': [
		// 	'error',
		// 	{
		// 		patterns: [
		// 			// no relative imports allowed, always use alias, it makes easier to move files later if necessary
		// 			'./**',
		// 			'../**',
		// 		],
		// 	},
		// ],
		'@typescript-eslint/no-unused-vars' : 'error',
		'@typescript-eslint/no-explicit-any': 'off',
		quotes                              : ['error', 'single'],
		semi                                : ['error', 'never'],
		'comma-dangle'                      : ['warn', 'always-multiline'],
		'eqeqeq'                            : 'off',
		'no-prototype-builtins'             : 'off',
		'yoda'                              : ['error', 'never'],
		'github/array-foreach'              : 'error',
		'space-infix-ops'                   : 'error',
		'no-trailing-spaces'                : 'error',
		'comma-spacing'                     : ['error', { 'before': false, 'after': true }],
		'key-spacing'                       : [2, {
			'singleLine': {
				'beforeColon': false,
				'afterColon' : true,
			},
			'multiLine': {
				'beforeColon': false,
				'afterColon' : true,
				'align'      : 'colon',
			},
		}],
		'keyword-spacing'     : 'error',
		'object-curly-spacing': ['error', 'always', { 'objectsInObjects': true }],
		'camelcase'           : ['warn', { 'properties': 'always' }],
	},
	overrides: [
		{
			files: [
				'**/__tests__/*.{j,t}s?(x)',
				'**/tests/unit/**/*.spec.{j,t}s?(x)',
			],
		},
		{
			files: ['tests/**/*.ts'],
			rules: {
				'no-restricted-imports': 'off',
			},
		},
		{
			files : ['*.json', '*.json5', '*.jsonc'],
			parser: 'jsonc-eslint-parser',
		},
	],
}
