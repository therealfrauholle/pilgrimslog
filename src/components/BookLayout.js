import React from 'react';

const BookLayout = ({ children }) => {
    return (
        <>
            <div className="min-h-screen bg-gray-100 font-sans">
                <div className="flex-grow top-4 mx-auto bg-white shadow-xl min-h-screen max-w-5xl mx-4">
                    <div className="h-full">{children}</div>
                </div>
            </div>
        </>
    );
};

export default BookLayout;
