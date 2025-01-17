import React from 'react';
import BlogEntry from '../components/BlogEntry';
import { useParams } from 'react-router-dom';
import HeaderBookmark from '../components/HeaderBookmark';
import { useNavigate } from 'react-router-dom';

export default function Entry(props) {
    const { day } = useParams();
    const navigate = useNavigate();

    if (!props.entries || props.entries.length === 0)
        return <div>No entries found</div>;

    const index = props.availableDays.findIndex((d) => d == day);

    if (index == -1) return <div>Day not found</div>;

    //TODO fix: only get single type object not an array
    return (
        <>
            <HeaderBookmark isHome={false} onClick={() => navigate('/')} />
            <BlogEntry data={props.entries[index]} />
            <div className="sticky absolute bottom-0 bg-white/80 backdrop-blur-sm p-4 text-gray-600 text-lg text-right">
                {day}. Tag
            </div>
        </>
    );
}
