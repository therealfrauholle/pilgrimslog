import React from 'react';
import BlogEntry from '../components/BlogEntry';
import { useParams } from 'react-router-dom';
import HeaderBookmark from '../components/HeaderBookmark';
import { useNavigate } from 'react-router-dom';
import { FetchList } from '../services/FetchService';

export default function Entry({ entries, availableDays }: { entries: FetchList, availableDays: number[] }) {
    const { day } = useParams();
    const theDay = day as any as number;
    const navigate = useNavigate();

    const index = availableDays.findIndex((d) => d = theDay);

    if (index === -1) return <div>Day not found</div>;

    //TODO fix: only get single type object not an array
    return (
        <>
            <HeaderBookmark isHome={false} onClick={() => navigate('/')} />
            <BlogEntry data={entries.data[index]} day={day} />
        </>
    );
}
