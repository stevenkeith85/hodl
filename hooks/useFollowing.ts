import useSWR from 'swr';
import { fetchWithAddress } from '../lib/swrFetchers';

export const useFollowing = (address, prefetchedFollowingCount=null, prefetchedFollowing=null) => {

    const { data: followingCount } = useSWR(
        address ? [`/api/follow/followingCount`, address] : null,
        fetchWithAddress,
        { 
            fallbackData: prefetchedFollowingCount,
            revalidateOnMount: true
        }
    )

    const { data: following } = useSWR(
        address ? [`/api/follow/following`, address] : null,
        fetchWithAddress,
        { 
            fallbackData: prefetchedFollowing,
            revalidateOnMount: true 
        }
    )

    return [followingCount?.count, following?.following];
}