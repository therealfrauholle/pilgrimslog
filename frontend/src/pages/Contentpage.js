import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBookmark from '../components/HeaderBookmark';
import EntriesList from '../components/EntriesList';

const Contentpage = () => {
  const [blogEntries, setBlogEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch('https://api.todaycounts.de/api/log-entries?populate=*&sort=When:asc&pagination[pageSize]=10000');
        const data = await response.json();
        setBlogEntries(data.data || []);
      } catch (error) {
        console.error('Error fetching blog entries:', error);
      }
    };

    fetchEntries();
  }, []);

  const formatDate = (dateString) => {
    const startDate = new Date('2024-05-07'); // Start date: 8 May 2024
    const givenDate = new Date(dateString);  // Convert the given date string to a Date object

    // Calculate the difference in milliseconds
    const differenceInMs = givenDate - startDate;

    // Convert milliseconds to days (1 day = 86400000 ms)
    const differenceInDays = Math.round(differenceInMs / (1000 * 60 * 60 * 24));

    return `${differenceInDays}`;
  };

  const handleEntrySelect = (day) => {
    console.log(day);
    navigate(`/Tag/${day}`);
  };

  return (
    <>
      <HeaderBookmark isHome={false} onClick={() => navigate('/')} />
      <EntriesList
        entries={blogEntries}
        formatDate={formatDate}
        onEntrySelect={handleEntrySelect}
      />
    </>
  );
};

export default Contentpage;
