import React from 'react';

interface ImageMessageProps {
  imageUrl: string;
  alt: string;
}

export function ImageMessage({ imageUrl, alt }: ImageMessageProps) {
  return (
    <div className="max-w-lg">
      <img 
        src={imageUrl} 
        alt={alt} 
        className="rounded-lg shadow-md w-full h-auto"
        loading="lazy"
      />
    </div>
  );
}