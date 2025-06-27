import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function StrapiMarkdownRenderer({ data }: { data: string }) {
    return (
        <div className="prose prose-plog text-sm md:text-xl tracking-wide leading-6 md:leading-8">
            <Markdown remarkPlugins={[remarkGfm]}>{data}</Markdown>
        </div>
    );
}
