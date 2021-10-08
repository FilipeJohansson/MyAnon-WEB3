const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_directory: './src/contracts',
  contracts_build_directory: './src/contracts',
  networks: {
    develop: {
      port: 8545
    }
  }
};
