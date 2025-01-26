import { useNavigate } from 'react-router-dom';
import EntriesList from '../components/EntriesList';
import { ILogEntries } from '../services/FetchService';
import { LinkLocation } from '../components/BottomBar';
import Book from '../components/Book';

export default function Contentpage({ entries }: { entries: ILogEntries }) {
    const navigate = useNavigate();

    const handleEntrySelect = (id: string) => {
        console.log(id);
        navigate(`/Tag/${id}`);
    };

    return (
        <>
            <Book
                previous={LinkLocation.homepage()}
                next={LinkLocation.entry(entries.data[0])}
                currentlySelectedDay={null}
            >
                <EntriesList
                    entries={entries}
                    onEntrySelect={handleEntrySelect}
                />
            </Book>
        </>
    );
}
