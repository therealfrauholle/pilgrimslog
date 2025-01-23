import { useEffect, useState } from 'react';
import haversine from 'haversine-distance';

export function useFetchAllEntries() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [blogEntries, setBlogEntries] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        const apiUrl =
            'https://api.todaycounts.de/api/log-entries?populate=*&sort=When:asc&pagination[pageSize]=10000';

        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Full API Response:', data); // Log the full response

                // Check the structure of the data
                if (data) {
                    const startgps = { lat: 52.5522859, lon: 13.3789186 };

                    let total = 0.0;
                    let lastgps = startgps;

                    data.data.forEach(function(entry) {
                        const thisgps = {
                            lat: entry.Where.lat,
                            lon: entry.Where.lng,
                        };
                        const newdistance = haversine(lastgps, thisgps);

                        total += newdistance * 1.25;

                        lastgps = thisgps;

                        entry.km = Math.round(total / 1000);
                        const startDate = new Date('2024-05-07'); // Start date: 8 May 2024
                        const givenDate = new Date(entry.When); // Convert the given date string to a Date object

                        entry.day = (givenDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
                    });
                    setBlogEntries(data);
                } else {
                    console.warn('Unexpected data structure:', data);
                    setBlogEntries(null);
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Fetch Error:', err);
                setError(err);
                setIsLoading(false);
            });
    }, []);

    // Return an object with more information
    return {
        blogEntries,
        isLoading,
        error,
    };
}
