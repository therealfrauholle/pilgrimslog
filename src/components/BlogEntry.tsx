import { ILogEntry } from '../services/FetchService';
import StrapiMarkdownRenderer from './StrapiMarkdownRenderer';

export default function BlogEntry({ data }: { data: ILogEntry }) {
    if (!data) {
        return <div>No blog posts available</div>;
    }

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
                {data.Location || 'Untilted'}
            </h1>
            <div className="grow overflow-y-auto">
                <StrapiMarkdownRenderer data={data.Content} />
            </div>
        </div>
    );
}
