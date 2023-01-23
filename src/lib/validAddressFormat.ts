export const validAddressFormat = (addr) => {
  return /^0x[A-Fa-f0-9]{40}$/.test(addr);
};
