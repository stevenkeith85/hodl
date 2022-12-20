
export const pluralize = (n: number, item: string) => {
  const v = n || 0;
  const endsWithY = item[item.length - 1] === 'y';
  return v !== 1 ? `${v} ${endsWithY ? item.slice(0, -1) + 'ies' : item + 's'}` : `1 ${item}`;
};
