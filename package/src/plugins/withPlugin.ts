import { ConfigPlugin } from "@expo/config-plugins";
import  withGenerablePackagePlugin from "./generateSwiftFilesInPackage";
import withIos26 from "./withIos26";

const withPlugin: ConfigPlugin = (config) => {
  config = withIos26(config)
  return withGenerablePackagePlugin(config)
}

export default withPlugin
