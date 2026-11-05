// Lets Metro bundle the card data in ../shared, which the web app also uses.
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
const sharedDir = path.resolve(__dirname, "../shared");

config.watchFolders = [...(config.watchFolders ?? []), sharedDir];
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules ?? {}),
  "@shared": sharedDir,
};

module.exports = config;
