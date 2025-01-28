// src/components/HeaderBookmark.jsx
import React from 'react';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Link from 'next/link';

const HeaderBookmark = ({
    isDisabled,
    onClick,
}: {
    isDisabled: boolean;
    onClick: string;
}) => {
    return (
        <Link
            href={onClick}
            style={isDisabled ? { color: 'gray' } : { color: 'orange' }}
            className={
                'absolute top-4 right-4 flex-col p-2 text-blue-500 hover:text-blue-600 bg-gray-100/30 border-gray-200/20 transition-colors border backdrop-blur-sm rounded-lg' +
                (isDisabled ? ' ' : ' shadow-md')
            }
            aria-label="Go to home page"
        >
            <FormatListBulletedIcon sx={{ fontSize: 48 }} />
        </Link>
    );
};

export default HeaderBookmark;
