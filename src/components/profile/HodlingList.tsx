import { useHodling } from '../../hooks/useHodling';
import { InfiniteScrollNftWindows } from '../InfiniteScrollNftWindows';


export const HodlingList = ({address, limit, prefetchedHodling}) => {
  const { swr: hodling } = useHodling(address, limit, prefetchedHodling);

  return (
    <InfiniteScrollNftWindows swr={hodling} limit={limit} pattern={false}/>
  )
}