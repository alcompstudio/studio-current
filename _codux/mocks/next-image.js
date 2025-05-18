import React from 'react';

// eslint-disable-next-line jsx-a11y/alt-text
const MockImage = ({ src, alt, width, height, ...props }) => {
  // In a real scenario, you might want to handle different src types (e.g., objects)
  // For simplicity, this mock assumes src is a string.
  return <img src={src} alt={alt} width={width} height={height} {...props} />;
};

export default MockImage;
