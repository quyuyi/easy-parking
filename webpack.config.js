const path = require("path");
const { addHarpWebpackConfig } = require("@here/harp-webpack-utils/scripts/HarpWebpackConfig");

module.exports = addHarpWebpackConfig(
    {
        mode: "development",
        entry: {
            "index": "./src/index.js",
            "harp-gl-decoder": "./src/harp-gl-decoder.js"
        },
        output: {
            filename: "[name].bundle.js",
            path: path.resolve(__dirname, "public/javascripts"),
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: ["babel-loader"],
                    resolve: {
                        extensions: [".js", ".jsx"]
                    }
                },
                {
                    test: /\.scss$/,
                    use: [
                        "style-loader",
                        "css-loader",
                        "resolve-url-loader",
                        "sass-loader",
                    ]
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: ["file-loader"]
                },
                {
                    test: /\.woff(2)?$/,
                    use: ["url-loader?limit=10000&mimetype=application/font-woff"]
                },
                {
                    test: /\.(eot|ttf|otf)$/,
                    use: ["file-loader"]
                }
            ]
        }
    },
    {}
);
