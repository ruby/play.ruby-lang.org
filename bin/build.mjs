import esbuild from "esbuild";
import { polyfillNode } from "esbuild-plugin-polyfill-node";
import { spawn } from "node:child_process"

const buildOptions = {
    entryPoints: ["src/index.ts", "src/ruby.worker.ts"],
    bundle: true,
    format: "esm",
    outdir: "./dist/build",
    splitting: true,
    sourcemap: true,
    logLevel: "info",
    loader: {
        '.ttf': 'file'
    },
    plugins: [
        polyfillNode(),
    ]
}
const action = process.argv[2] ?? "build"
switch (action) {
    case "dev": {
        const ctx = await esbuild.context(buildOptions)
        const build = ctx.watch()
        spawn("ruby", ["-run", "-e", "httpd", "./dist"], { stdio: "inherit" })
        await build
        break
    }
    case "build": {
        await esbuild.build(buildOptions)
        break
    }
    default:
        console.error("Unknown action:", action)
        process.exit(1)
}
