import React from 'react';
import StrapiMarkdownRenderer from './StrapiMarkdownRenderer';


const BlogEntry = ({ data }) => {
  // Extract the array of blog posts from the nested structure
  const blogPosts = data
  
  console.log('Blog posts:', blogPosts);

  if (!blogPosts) {
    return <div>No blog posts available</div>;
  }

  return (
    <div className="p-6 md:p-8">
        <div 
          key={blogPosts.id}
          style={{ 
            maxWidth: '800px', 
            border: '20px', 
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>
            {blogPosts.Location || 'Untilted'}
          </h1>
          <div>
            <StrapiMarkdownRenderer data={blogPosts.Content}/>
          </div>
        </div>
    </div>
  );
};

export default BlogEntry;