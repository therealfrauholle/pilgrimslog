import React from 'react';

const BlockRenderer = ({ block }) => {
  if (!block || !block.children) return null;
  
  switch (block.type) {
    case 'paragraph':
      return <p style={{ marginBottom: '1rem' }}>
        {block.children.map((child, i) => child.text).join('')}
      </p>;
    case 'heading':
      return <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '1rem 0'}}>
        {block.children.map((child, i) => child.text).join('')}
      </h2>;
    default:
      return null;
  }
};

const BlogEntry = ({ data }) => {
  // Extract the array of blog posts from the nested structure
  const blogPosts = data
  
  console.log('Blog posts:', blogPosts);

  if (!blogPosts) {
    return <div>No blog posts available</div>;
  }

  return (
    <div>
        <div 
          key={blogPosts.id}
          style={{ 
            maxWidth: '800px', 
            margin: '20px auto', 
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>
            {blogPosts.Location || 'Untilted'}
          </h1>
          <div>
            {blogPosts.Content}
          </div>
        </div>
    </div>
  );
};

export default BlogEntry;