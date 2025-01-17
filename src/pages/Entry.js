import React from 'react'
import { useFetchSingleEntryByDay } from '../services/FetchService'
import BlogEntry from '../components/BlogEntry'
import { useParams } from 'react-router-dom';
import HeaderBookmark from '../components/HeaderBookmark';
import { useNavigate } from 'react-router-dom';

export default function Entry() {
  const { day } = useParams()
  const { blogEntry, isLoading, error } = useFetchSingleEntryByDay(day);
  const navigate = useNavigate();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!blogEntry || blogEntry.length === 0) return <div>No entries found</div>;


  //TODO fix: only get single type object not an array
  return (
    <>
      <HeaderBookmark isHome={false} onClick={() => navigate('/')}/>
      <BlogEntry data={blogEntry} />
      <div className="sticky absolute bottom-0 bg-white/80 backdrop-blur-sm p-4 text-gray-600 text-lg text-right">
        {day}. Tag
      </div>
    </>
  )
};
