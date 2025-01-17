import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Homepage from '../pages/Homepage'
import Contentpage from '../pages/Contentpage'
import Entry from '../pages/Entry'
import { useFetchAllEntries } from '../services/FetchService';
import NavigationButtons from '../components/NavigationButtons'

export default function RoutingService() {

  const { blogEntries, isLoading, error } = useFetchAllEntries();
    
  // Add this console.log to debug
  console.log('blogEntries:', blogEntries.data);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;


  const formatDate = (dateString) => {
      const startDate = new Date('2024-05-07');
      const givenDate = new Date(dateString);
      const differenceInMs = givenDate - startDate;
      const differenceInDays = Math.round(differenceInMs / (1000 * 60 * 60 * 24));
      return `${differenceInDays}`;
  };

  // Use Array.map instead of forEach for better readability
  const availableDays = blogEntries.data.map(entry => formatDate(entry.When));

  return (
    <Router>
        <div className="body">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/Content" element={<Contentpage />} />
              <Route path="/Tag/:day" element={<Entry />} />
              <Route path="/:slug" element={<Homepage />} />
            </Routes>
        </div>
        <NavigationButtons availableDays={availableDays}/>
      </Router>
  )
}
