export const truncateText = (text, length = 30) => {
    if (!text) {
      return '';
    }
  
    if (text.length > length) {
      return text.slice(0, length) + '...';
    }
  
    return text;
  }
  