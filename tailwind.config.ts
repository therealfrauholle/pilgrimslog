import type { Config } from 'tailwindcss';
import * as T from '@tailwindcss/typography';
import { PluginUtils } from 'tailwindcss/types/config';

export default {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                neutral: 'var(--color-plog-neutral)',
                extra: 'var(--color-plog-extra)',
                normal: 'var(--color-plog-normal)',
                feature: 'var(--color-plog-feature)',
                highlight: 'var(--color-plog-highlight)',
                detail: 'var(--color-plog-detail)',
                accent: 'var(--color-plog-accent)',
            },
            typography: ({ theme }: PluginUtils) => ({
                plog: {
                    css: {
                        '--tw-prose-headings': theme('colors.extra'),
                        '--tw-prose-quote-borders': theme('colors.accent'),
                        '--tw-prose-th-borders': theme('colors.accent'),
                        '--tw-prose-td-borders': theme('colors.accent'),
                    },
                },
            }),
        },
    },
    plugins: [T.default],
} satisfies Config;
