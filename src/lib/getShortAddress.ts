
export const getShortAddress = address => {
  if (!address) {
    return '';
  }
  return (address?.slice(0, 5) + '...' + address?.slice(-4)).toLowerCase();
};
