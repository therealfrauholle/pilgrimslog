import React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from '../pages/Homepage';
import Contentpage from '../pages/Contentpage';
import Entry from '../pages/Entry';
import { fetchAll } from '../services/FetchService';
import NavigationButtons from '../components/NavigationButtons';

export default function RoutingService() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [blogEntries, setBlogEntries] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        fetchAll().then((data) => {
            setIsLoading(false);
            setBlogEntries(data);
        }).catch((err) => {
            console.error('Fetch Error:', err);
            setError(err);
            setIsLoading(false);
        });
    }, []);

    const entries = (blogEntries as any).data;

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const formatDate = (dateString: string) => {
        const startDate = new Date('2024-05-07');
        const givenDate = new Date(dateString);

        return (givenDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    };

    // Use Array.map instead of forEach for better readability
    const availableDays = (blogEntries as any).data.map((entry) =>
        formatDate(entry.When),
    );

    return (
        <Router>
            <div className="body h-dvh">
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route
                        path="/Content"
                        element={<Contentpage entries={entries} />}
                    />
                    <Route
                        path="/Tag/:day"
                        element={
                            <Entry
                                entries={entries}
                                availableDays={availableDays}
                            />
                        }
                    />
                    <Route path="/:slug" element={<Homepage />} />
                </Routes>
            </div>
            <NavigationButtons availableDays={availableDays} />
        </Router>
    );
}
