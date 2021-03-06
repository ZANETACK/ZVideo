import babel from "rollup-plugin-babel";
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';

export default {
    input: './src/main.js',
    output: {
        file: 'dist/zvideo/index.min.js',
        name: 'ZVideo',
        format: 'umd',
        sourcemap: false,
        minify: true
    },
    plugins: [
        json(),
        babel({
            exclude: 'node_modules/**'
        }),
        replace({
            ENVIRONMENT: JSON.stringify('production')
        }),
        terser({
            output: {
                ascii_only: true // 仅输出ascii字符
            }
        })
    ]
}
