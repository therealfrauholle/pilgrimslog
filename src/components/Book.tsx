import HeaderBookmark from "./HeaderBookmark";
import NavigationButtons, { LinkLocation } from "./NavigationButtons";

export default function Book({ pageContent, previous, next }: { pageContent: any, previous: LinkLocation | undefined, next: LinkLocation | undefined }) {



    return (
        <>
            <HeaderBookmark
                isHome={true}
                onClick={console.log('Already home!')}
            />
            {pageContent}
            <NavigationButtons previous={previous} next={next} />
        </>
    )
}