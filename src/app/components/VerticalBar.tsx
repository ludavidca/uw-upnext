import React from 'react';

interface VerticalBarProps {
  height?: string; // Optional: Allows you to specify the height of the bar
  width?: string;  // Optional: Allows you to specify the width of the bar
}

const VerticalBar: React.FC<VerticalBarProps> = ({ height = '100%', width = '2px' }) => {
  return (
    <div className="absolute inline rounded-full ml-[1.5%]"
      style={{
        backgroundColor: 'white', // White color
        width: width,             // Thin width
        height: height,           // Full height
      }}
    />
  );
};

export default VerticalBar;
