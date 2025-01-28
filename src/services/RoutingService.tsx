import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from '../pages/Homepage';
import Contentpage from '../pages/Contentpage';
import Entry from '../pages/Entry';
import { fetchAll, ILogEntries } from '../services/FetchService';
import { CircularProgress } from '@mui/material';

export default function RoutingService() {
    const [error, setError] = useState(null);
    const [entries, setBlogEntries] = useState<ILogEntries>(null);

    useEffect(() => {
        fetchAll()
            .then((data) => {
                setBlogEntries(data);
            })
            .catch((err) => {
                console.error('Fetch Error:', err);
                setError(err);
            });
    }, []);

    if (error == null && entries == null) {
        return (
            <>
                <CircularProgress />
            </>
        );
    }

    if (error != null) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="flex grid h-dvh w-screen justify-items-center bg-zinc-200 md:p-[20px]">
            <div className="flex flex-col h-full min-h-0 w-full md:w-[700px] bg-mint-500 shadow-md">
                <Router>
                    <Routes>
                        <Route path="/" element={<Homepage />} />
                        <Route
                            path="/Content"
                            element={<Contentpage entries={entries} />}
                        />
                        <Route
                            path="/Tag/:id"
                            element={<Entry entries={entries} />}
                        />
                        <Route path="/:slug" element={<Homepage />} />
                    </Routes>
                </Router>
            </div>
        </div>
    );
}
