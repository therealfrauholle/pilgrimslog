import React from 'react';
import StrapiMarkdownRenderer from './StrapiMarkdownRenderer';
import { ILogEntry } from '@/util/FetchService';

const BlogEntry = React.memo(function BlogEntry({
    data: day,
}: {
    data: ILogEntry;
}) {
    return (
        <div
            style={{
                padding: '50px 50px 10px 50px',
            }}
            className="flex flex-col p-6 md:p-8 h-full"
        >
            <h1
                style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '2rem',
                }}
            >
                {day.Location || 'Untilted'}
            </h1>
            <div className="grow overflow-y-auto">
                <StrapiMarkdownRenderer data={day.Content} />
            </div>
        </div>
    );
});

export default BlogEntry;
