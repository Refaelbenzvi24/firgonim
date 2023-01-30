import Icons from 'unplugin-icons/webpack'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/webpack'

// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
    images:          {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ik.imagekit.io',
                pathname: '/irjqhb7l6/**'
            }
        ]
    },
    reactStrictMode: true,
    swcMinify:       true,
    webpack:         (config) => {
        config.plugins.push(
            Icons({
                compiler: 'jsx',
                jsx:      'react'
            }),
        )

        config.plugins.push(
            AutoImport({
                resolvers: [
                    IconsResolver({
                        componentPrefix: 'Icon',
                        extension:       'jsx'
                    })
                ],
                include:   [
                    /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                    /\.md$/, // .md
                ],
                dts:       'src/auto-imports.d.ts',
            })
        )

        return config
    },
    i18n:            {
        locales:       ["en"],
        defaultLocale: "en",
    },
};
export default config;
