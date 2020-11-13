import babel from "rollup-plugin-babel";
import serve from "rollup-plugin-serve";
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';

export default {
    input: './src/main.js',
    output: {
        file: 'dist/zvideo/index.js',
        name: 'ZVideo',
        format: 'umd',
        sourcemap: true,
        minify: false
    },
    plugins: [
        json(),
        babel({
            exclude: 'node_modules/**'
        }),
        serve({
            open: true,
            openPage: '/dist/zvideo/public/index.html',
            port: 3000,
            contentBase: ''
        }),
        replace({
            ENVIRONMENT: JSON.stringify('development')
        })
    ]
}
