import { FetchEntry, FetchList } from '../services/FetchService';

export default function EntriesList({ entries, formatDate, onEntrySelect }: { entries: FetchList; formatDate: (dateString: string) => number; onEntrySelect: (day: number) => void; }) {
    return (
        <div className="flex flex-col h-dvh p-6 md:p-8">
            <div
                className="text-4xl font-bold mb-6 text-gray-800"
                style={{ padding: '40px' }}
            >
                Einträge
            </div>
            <div className="overflow-y-auto grow">
                {entries.data.map((entry: FetchEntry, index: number) => (
                    <button
                        key={index}
                        onClick={() => onEntrySelect(formatDate(entry.When))}
                        className="w-full group"
                    >
                        <div
                            className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-200 pb-2"
                            style={{ padding: '10px' }}
                        >
                            <span className="text-lg font-medium">
                                {entry.Location || 'Untitled'}
                            </span>
                            <span className="text-base text-gray-600">
                                {formatDate(entry.When)}. Tag | ≈{entry.km}km
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

