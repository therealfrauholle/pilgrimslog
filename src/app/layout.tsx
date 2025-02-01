import './globals.css';
import { Metadata, Viewport } from 'next';
import Book from '@/components/Book';

export const viewport: Viewport = {
    themeColor: '#000000',
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    description: 'Logbuch eines Pilgers',
};

export default function MyApp({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <main>
                    <Book>{children}</Book>
                </main>
            </body>
        </html>
    );
}
