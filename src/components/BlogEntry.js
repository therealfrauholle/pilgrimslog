import React from 'react';
import StrapiMarkdownRenderer from './StrapiMarkdownRenderer';

const BlogEntry = ({ data, day }) => {
    // Extract the array of blog posts from the nested structure
    const blogPosts = data;

    console.log('Blog posts:', blogPosts);

    if (!blogPosts) {
        return <div>No blog posts available</div>;
    }

    return (
        <div
            key={blogPosts.id}
            style={{
                padding: '60px',
            }}
            className="flex flex-col p-6 md:p-8 h-dvh"
        >
            <h1
                style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    marginBottom: '2rem',
                }}
            >
                {blogPosts.Location || 'Untilted'}
            </h1>
            <div className="grow">
                <StrapiMarkdownRenderer data={blogPosts.Content} />
            </div>
            <div className="sticky absolute bottom-0 backdrop-blur-sm p-4 text-gray-600 text-lg text-right">
                {day}. Tag | ≈{blogPosts.km}km
            </div>
        </div>
    );
};

export default BlogEntry;
