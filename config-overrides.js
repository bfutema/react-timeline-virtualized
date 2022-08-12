const { alias, configPaths } = require('react-app-rewire-alias');

const aliasMap = configPaths('./tsconfig.paths.json');

const override = config => alias(aliasMap)(config);

module.exports = override;
