import useSWR from 'swr';
import { fetchWithAddress } from '../lib/swrFetchers';

export const useFollowing = (address, prefetchedFollowingCount=null, prefetchedFollowing=null) => {

    const { data: followingCount } = useSWR(
        address ? [`/api/follow2/followingCount`, address] : null,
        fetchWithAddress,
        { 
            fallbackData: prefetchedFollowingCount,
            revalidateOnMount: true
        }
    )

    const { data: following } = useSWR(
        address ? [`/api/follow2/following`, address] : null,
        fetchWithAddress,
        { fallbackData: prefetchedFollowing }
    )

    return [followingCount?.count, following?.following];
}