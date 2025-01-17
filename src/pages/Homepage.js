import React from 'react';
import HeaderBookmark from '../components/HeaderBookmark';
import CoverPage from './CoverPage';

const Homepage = () => {
  return (
    <>
      <HeaderBookmark isHome={true} />
        <CoverPage />
    </>
  );
};

export default Homepage;
