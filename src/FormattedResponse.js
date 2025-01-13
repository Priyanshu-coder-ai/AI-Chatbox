import React from 'react';

const FormattedResponse = ({ content }) => {
  const formatContent = (text) => {
    // Split the text into sections based on bold headers
    const sections = text.split(/\*\*(.*?)\*\*/);
    
    return sections.map((section, index) => {
      if (index % 2 === 1) {
        // This is a header
        return <h3 key={index} className="font-bold mt-4 mb-2">{section}</h3>;
      } else {
        // This is content
        const lines = section.split('*');
        return lines.map((line, lineIndex) => {
          const trimmedLine = line.trim();
          if (trimmedLine.length > 0) {
            if (trimmedLine.startsWith('-')) {
              // This is a bullet point
              return <li key={lineIndex} className="ml-4">{trimmedLine.substring(1).trim()}</li>;
            } else {
              // This is a regular paragraph
              return <p key={lineIndex} className="mb-2">{trimmedLine}</p>;
            }
          }
          return null;
        });
      }
    });
  };

  return (
    <div className="formatted-response">
      {formatContent(content)}
    </div>
  );
};

export default FormattedResponse;

