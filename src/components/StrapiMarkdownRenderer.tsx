import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function StrapiMarkdownRenderer({ data }: { data: string }) {
    return (
        <div className="strapi-markdown-content prose">
            <Markdown remarkPlugins={[remarkGfm]}>{data}</Markdown>
        </div>
    );
}
