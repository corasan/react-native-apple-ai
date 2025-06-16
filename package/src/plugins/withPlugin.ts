import { ConfigPlugin } from "@expo/config-plugins";
import withGenerablePlugin from "./withGenerablePlugin";
import withIos26 from "./withIos26";

const withPlugin: ConfigPlugin = (config) => {
  config = withGenerablePlugin(config)
  return withIos26(config)
}

export default withPlugin
