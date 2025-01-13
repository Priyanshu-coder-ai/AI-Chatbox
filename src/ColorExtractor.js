import { useEffect } from 'react';
import ColorThief from 'colorthief';

const ColorExtractor = ({ src, onColorExtracted }) => {
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;

    img.onload = () => {
      const colorThief = new ColorThief();
      const color = colorThief.getColor(img);
      onColorExtracted(color);
    };
  }, [src, onColorExtracted]);

  return null;
};

export default ColorExtractor;

