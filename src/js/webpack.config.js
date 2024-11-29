/*import { resolve } from "path";

export const entry = "./index.js";
export const output = {
  path: resolve(__dirname, "dist"),
  filename: "bundle.js", // The name of your bundled file
};*/

const path = require('path');

module.exports = {
    entry: './index.js', // Your main JavaScript file
    output: {
        path: path.resolve(__dirname, '../../dist'),
        filename: 'bundle.js', // The name of your bundled file
    },
    mode: 'development',
    module: {
        rules: [{ test: /\.svg$/, type: 'asset/source' }],
    },
};
