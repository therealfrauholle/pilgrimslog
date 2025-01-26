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
        return <><CircularProgress /></>;
    }

    if (error != null) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className='flex grid w-screen justify-items-center'>
            <div className="flex flex-col h-dvh w-full md:w-1/2">
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
