import { useEffect, useState } from 'react';

export function useFetchSingleEntryByDay(daysToAdd) {
    const startDate = new Date('2024-05-07');
    const newDate = new Date(startDate.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
    const entryString = newDate.toISOString().split('T')[0];
    
    const [blogEntry, setBlogEntry] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        const apiUrl = `https://api.todaycounts.de/api/log-entries?filters[When][$eq]=${entryString}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Full API Response:', data); // Log the full response
                
                // Check the structure of the data
                if (data && data.data) {
                    setBlogEntry(data.data[0]);
                } else {
                    console.warn('Unexpected data structure:', data);
                    setBlogEntry(null);
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Fetch Error:', err);
                setError(err);
                setIsLoading(false);
            });
    }, [entryString]);

    // Return an object with more information
    return {
        blogEntry,
        isLoading,
        error
    };
}


export function useFetchAllEntries() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [blogEntries, setBlogEntries] = useState([]);


    useEffect(() => {
        setIsLoading(true);
        const apiUrl = 'https://api.todaycounts.de/api/log-entries?populate=*&sort=When:asc&pagination[pageSize]=10000';

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Full API Response:', data); // Log the full response
                
                // Check the structure of the data
                if (data) {
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
        error
    };
}
