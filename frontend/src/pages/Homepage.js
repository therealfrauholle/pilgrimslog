import React, { useState, useEffect } from 'react';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Bookmark from '@mui/icons-material/Bookmark';
import BlogEntry from '../components/BlogEntry';


const Homepage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [blogEntries, setBlogEntries] = useState([]);
  
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch('http://api.todaycounts.de/api/log-entries?populate=*&sort=When:asc');
        const data = await response.json();
        setBlogEntries(data.data || []);
      } catch (error) {
        console.error('Error fetching blog entries:', error);
      }
    };
    
    fetchEntries();
  }, []);

  const totalPages = 2 + blogEntries.length;

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  const formatDate = (dateString) => {
    const startDate = new Date('2024-05-07'); // Start date: 8 May 2024
    const givenDate = new Date(dateString);  // Convert the given date string to a Date object
  
    // Calculate the difference in milliseconds
    const differenceInMs = givenDate - startDate;
  
    // Convert milliseconds to days (1 day = 86400000 ms)
    const differenceInDays = Math.round(differenceInMs / (1000 * 60 * 60 * 24));
  
    return `${differenceInDays}. Tag`;
  };


  const goToHome = () => {
    setCurrentPage(0);
  };


  const renderPage = () => {
    if (currentPage === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-6" style={{padding: '30px'}}>
          <div className="tracking-tight max-w-lg mx-auto text-center text-gray-800 transition-colors">
            <h1 className="text-6xl font-extrabold mb-6">Logbuch</h1>
            <div className="text-3xl text-left pl-4">eines Pilgers</div>
          </div>
          <div style={{padding: '30px'}}>
            <p className="text-lg md:text-xl text-gray-600">A collection of thoughts and experiences</p>
          </div>
        </div>
      );
    }
    
    if (currentPage === 1) {
      return (
        <div className="p-6 md:p-8">
          <h2 className="text-6xl font-bold mb-6 text-gray-800" style={{padding: '30px'}}>Einträge</h2>
          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
            {blogEntries.map((entry, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index+2)}
                className='w-full group'
                >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-200 pb-2">
                  <span className="text-base md:text-lg font-medium">
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>
                      {entry.Location|| 'Untitled'}
                    </h1>
                  </span>
                  <span className="text-sm md:text-base text-gray-600">{formatDate(entry.When)}</span>
                  </div>
              </button>
            ))}
          </div>
        </div>
      );
    }
    
    const entryIndex = currentPage - 2;
    const entry = blogEntries[entryIndex];
    
    if (entry) {
      return (
        <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <BlogEntry data={entry}/>
          {/* Footer with date */}
          <div className="absolute bottom-0 right-0 p-4 text-gray-600 text-lg">
            {formatDate(entry.When)}
          </div>
        </div>
      );
    }
  };


  return (
  <div className="min-h-screen bg-gray-100  font-sans">
    {/* Header */}
    <div className="fixed top-4 left-0 right-0 z-10">
       {/* Container with max width on larger screens */}
      <div className="mx-auto max-w-6xl relative">
        {/* Container positioned just outside the page content */}
        <div className="fixed top-4 right-4 lg:right-[15%] xl:right-[25%] transition-all duration-300">
          <button
            onClick={goToHome}
            className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
            aria-label="Go to home page"
          >
           <Bookmark fontSize="large"
            sx={{ 
              fontSize: 48,   // Custom pixel size
              color: 'orange'   // Color customization
              }} 
            />
         </button>
          </div>
        </div>
      </div>
      {/* Book Container */}
      <div className="relative top-4 mx-auto bg-white shadow-xl min-h-screen max-w-5xl  ">
        {/* Page Content */}
        <div className="relative min-h-screen">
          {renderPage()}
          {/* Full-height Navigation Buttons */}
          <div className="fixed inset-y-0 left-0 right-0 pointer-events-none flex justify-between">
            <div className="pointer-events-auto h-full">
              {currentPage > 0 && (
                <button
                  onClick={handlePrevPage}
                  className="h-full px-2 bg-gradient-to-l hover:bg-gradient-to-r from-transparent to-stone-400 transition-all flex items-center"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
            </div>
            <div className="pointer-events-auto h-full">
              {currentPage < totalPages - 1 && (
                <button
                  onClick={handleNextPage}
                  className="h-full px-2 bg-gradient-to-r hover:bg-gradient-to-l from-transparent to-stone-400 transition-all flex items-center"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Homepage;