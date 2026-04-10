import { RuleSetRule } from "webpack";

const rules: RuleSetRule[] = [
  {
    test: /\.scss$/,
    use: [
      "style-loader",
      {
        loader: "css-loader",
        options: {
          modules: {
            localIdentName: "[local]--[hash:base64:8]"
          },
          sourceMap: true,
          importLoaders: 1
        }
      },
      {
        loader: "sass-loader",
        options: {
          implementation: require("node-sass")
        }
      }
    ]
  }
];
