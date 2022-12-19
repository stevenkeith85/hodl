import { useListed } from '../../hooks/useListed';
import { InfiniteScrollNftWindows } from '../InfiniteScrollNftWindows';


export const ListedList = ({address, limit, prefetchedListed}) => {
  const { swr: listed } = useListed(address, limit, prefetchedListed);

  return (
    <InfiniteScrollNftWindows swr={listed} limit={limit} pattern={false}/>
  )
}