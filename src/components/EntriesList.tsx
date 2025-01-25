import { ILogEntry, ILogEntries } from '../services/FetchService';

export default function EntriesList({
    entries,
    onEntrySelect,
}: {
    entries: ILogEntries;
    onEntrySelect: (id: string) => void;
}) {
    return (
        <div className="flex flex-col h-dvh p-6 md:p-8">
            <div
                className="text-4xl font-bold mb-6 text-gray-800"
                style={{ padding: '40px' }}
            >
                Einträge
            </div>
            <div className="overflow-y-auto grow">
                {entries.data.map((entry: ILogEntry, index: number) => (
                    <button
                        key={index}
                        onClick={() => onEntrySelect(entry.Id)}
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
                                {entry.getDaysSinceStart()}. Tag | ≈{entry.km}km
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
