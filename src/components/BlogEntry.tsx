import { FetchEntry } from '../services/FetchService';
import StrapiMarkdownRenderer from './StrapiMarkdownRenderer';

export default function BlogEntry({ data, day }: { data: FetchEntry, day: string }) {
    console.log('Rendering entry: ', data);

    if (!data) {
        return <div>No blog posts available</div>;
    }

    return (
        <div
            style={{
                padding: '50px 50px 10px 50px',
            }}
            className="flex flex-col p-6 md:p-8 h-dvh"
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
            <div className="p-4 text-gray-600 text-lg text-right">
                {day}. Tag | ≈{data.km}km
            </div>
        </div>
    );
};

