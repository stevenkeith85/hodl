export const getTopPadding = (ratio) => {
  if (!ratio) {
    return 0;
  }

  const [width, height] = ratio.split(':');
  return (height / width) * 100;
};
