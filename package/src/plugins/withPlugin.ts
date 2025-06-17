import { ConfigPlugin } from "@expo/config-plugins";
import withGenerablePlugin from "./withGenerablePlugin";
import withIos26 from "./withIos26";

const withPlugin: ConfigPlugin = (config) => {
  config = withIos26(config)
  return withGenerablePlugin(config)
}

export default withPlugin
