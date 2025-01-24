import HeaderBookmark from '../components/HeaderBookmark';
import { LinkLocation } from '../components/NavigationButtons';
import NavigationButtons from '../components/NavigationButtons';
import CoverPage from './CoverPage';

export default function Homepage() {
    return (
        <>
            <HeaderBookmark isHome={true} onClick={console.log("Already home!")} />
            <CoverPage />

            <NavigationButtons previous={null} next={LinkLocation.content()} />
        </>
    );
};

