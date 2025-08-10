import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { BookPageIndex } from '@/util/BookPageIndex';

type NavigationButtonsProps = {
    currentIndex: BookPageIndex;
    onNavigate: (index: BookPageIndex) => void;
};

export function NavigationButtons({
    currentIndex,
    onNavigate,
}: NavigationButtonsProps) {
    return (
        <>
            <div
                className="nav-button"
                style={{
                    left: '0%',
                    zIndex: 2000,
                    opacity: currentIndex.navPrev() ? 1 : 0,
                }}
                onClick={() => {
                    const previous = currentIndex.navPrev();
                    if (previous) {
                        onNavigate(previous);
                    }
                }}
                role="button"
            >
                <ArrowBack
                    sx={{
                        fontSize: '36px',
                        fill: '#303030',
                        stroke: '#FEF4EC',
                        strokeWidth: 0.5,
                    }}
                />
            </div>
            <div
                className="nav-button"
                style={{
                    right: '0%',
                    zIndex: 2000,
                    opacity: currentIndex.navNext() ? 1 : 0,
                }}
                onClick={() => {
                    const next = currentIndex.navNext();
                    if (next) {
                        onNavigate(next);
                    }
                }}
                role="button"
            >
                <ArrowForward
                    sx={{
                        fontSize: '36px',
                        fill: '#303030',
                        stroke: '#FEF4EC',
                        strokeWidth: 0.5,
                    }}
                />
            </div>
        </>
    );
}
