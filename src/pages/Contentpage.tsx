import { useNavigate } from 'react-router-dom';
import HeaderBookmark from '../components/HeaderBookmark';
import EntriesList from '../components/EntriesList';
import { FetchList } from '../services/FetchService';

export default function Contentpage({ entries }: { entries: FetchList }) {
    const navigate = useNavigate();

    const formatDate = (dateString: string) => {
        const startDate = new Date('2024-05-07'); // Start date: 8 May 2024
        const givenDate = new Date(dateString); // Convert the given date string to a Date object

        return (givenDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    };

    const handleEntrySelect = (day: number) => {
        console.log(day);
        navigate(`/Tag/${day}`);
    };

    return (
        <>
            <HeaderBookmark isHome={false} onClick={() => navigate('/')} />
            < EntriesList
                entries={entries}
                formatDate={formatDate}
                onEntrySelect={handleEntrySelect}
            />
        </>
    );
};

