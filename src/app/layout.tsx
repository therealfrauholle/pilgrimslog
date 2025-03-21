import './globals.scss';
import { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
    themeColor: '#000000',
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    description: 'Logbuch eines Pilgers',
    title: 'Logbuch eines Pilgers',
};

export default function MyApp({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <main>{children}</main>
            </body>
        </html>
    );
}
