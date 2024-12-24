import React from 'react';

const EntriesList = ({ entries, formatDate, onEntrySelect }) => {
  return (
    <div className="p-6 md:p-8">
      <h2 className="text-6xl font-bold mb-6 text-gray-800" style={{ padding: '30px' }}>Einträge</h2>
      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
        {entries.map((entry, index) => (
          <button
            key={index}
            onClick={() => onEntrySelect(formatDate(entry.When))}
            className='w-full group'
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-200 pb-2">
              <span className="text-base md:text-lg font-medium">
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  {entry.Location || 'Untitled'}
                </h1>
              </span>
              <span className="text-sm md:text-base text-gray-600">{formatDate(entry.When)}. Tag </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EntriesList;
