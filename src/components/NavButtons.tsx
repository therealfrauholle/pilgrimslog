import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { BookPageIndex } from '@/util/BookPageIndex';

type NavigationButtonsProps = {
    previous: BookPageIndex | null;
    next: BookPageIndex | null;
    onNavigate: (index: BookPageIndex) => void;
};

export function NavigationButtons({
    onNavigate,
    previous,
    next,
}: NavigationButtonsProps) {
    return (
        <>
            <div
                className="nav-button"
                style={{
                    left: '0%',
                    zIndex: 2000,
                    opacity: previous ? 1 : 0,
                }}
                onClick={() => {
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
                    opacity: next ? 1 : 0,
                }}
                onClick={() => {
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
