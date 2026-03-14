process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({
  module: 'commonjs',
  moduleResolution: 'node',
});

require('ts-node/register/transpile-only');
require('tsconfig-paths/register');
require('../tests/unit/trust-workflows.cjs');
