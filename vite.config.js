import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import preprocess from "svelte-preprocess";
import { resolve } from 'path';

export default defineConfig({
    server: {
        port: 5000,
    },

    plugins: [
        svelte({
            preprocess: [preprocess()],
        }),
    ],

    resolve: {
        alias: {
            '$': resolve(__dirname, './src'),
            "$css": resolve(__dirname, "./src/css"),
            "$components": resolve(__dirname, "./src/pages/_components"),
            "$icons": resolve(__dirname, "./src/pages/_components/icons"),
            "$helpers": resolve(__dirname, "./src/helpers"),
            '$stores': resolve(__dirname, './src/stores'),
            '$vendor': resolve(__dirname, './src/vendor'),
        }
    },
});
