import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function StrapiMarkdownRenderer(content) {

  console.log(content)
  if(!content) return (<div className='markdown-error'>Kein Inhalt verfügbar.</div>);    
  return (
    <div className='strapi-markdown-content'>
      <Markdown children={content.data} remarkPlugins={[remarkGfm]} />
    </div>
  )
}
