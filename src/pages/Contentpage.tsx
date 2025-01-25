import { useNavigate } from 'react-router-dom';
import HeaderBookmark from '../components/HeaderBookmark';
import EntriesList from '../components/EntriesList';
import { FetchList } from '../services/FetchService';
import NavigationButtons, {
    LinkLocation,
} from '../components/NavigationButtons';

export default function Contentpage({ entries }: { entries: FetchList }) {
    const navigate = useNavigate();

    const handleEntrySelect = (day: number) => {
        console.log(day);
        navigate(`/Tag/${day}`);
    };

    return (
        <>
            <HeaderBookmark isHome={false} onClick={() => navigate('/')} />
            <EntriesList entries={entries} onEntrySelect={handleEntrySelect} />
            <NavigationButtons
                previous={LinkLocation.homepage()}
                next={LinkLocation.day(entries.data[0])}
            />
        </>
    );
}
