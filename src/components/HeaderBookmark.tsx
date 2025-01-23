// src/components/HeaderBookmark.jsx
import React from 'react';
import Bookmark from '@mui/icons-material/Bookmark';

const HeaderBookmark = ({ isHome, onClick }) => {
    return (
        <div className="fixed top-4 left-0 right-0 z-10">
            <div className="mx-auto max-w-6xl relative">
                <div className="fixed top-4 right-4 lg:right-[15%] xl:right-[25%] transition-all duration-300">
                    <button
                        disabled={isHome}
                        onClick={onClick}
                        style={isHome ? { color: 'gray' } : { color: 'orange' }}
                        className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
                        aria-label="Go to home page"
                    >
                        <Bookmark
                            sx={isHome ? { fontSize: 32 } : { fontSize: 48 }}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeaderBookmark;
