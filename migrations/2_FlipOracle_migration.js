const FlipOracle = artifacts.require("FlipOracle");

module.exports = function(deployer) {
  deployer.deploy(FlipOracle);
};
