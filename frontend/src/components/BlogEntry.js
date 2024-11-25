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

const LocationDisplay = ({ location }) => {
  if (!location || !location.locations || !location.locations.length) return null;
  
  return (
    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>
      {location.locations.map(loc => loc.name).join(', ') || 'Untitled'}
    </h1>
  );
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
          {<LocationDisplay location={blogPosts.location} />}
          <div>
            {blogPosts.body && Array.isArray(blogPosts.body) && blogPosts.body.map((block, index) => (
              <BlockRenderer key={index} block={block} />
            ))}
          </div>
          <div>
            {blogPosts.media && Array.isArray(blogPosts.media) && blogPosts.media.map((block, index) => (
              <img key={index} src={`http://localhost:1337${block.url}`} alt="" className="w-full md:w-4/5 lg:w-3/4 h-auto object-cover rounded-lg mx-auto"/>
            ))}
          </div>
        </div>
    </div>
  );
};

export default BlogEntry;