import useSWR from 'swr';
import { fetchWithAddress } from '../lib/swrFetchers';

export const useFollowing = (address, prefetchedFollowingCount=null, prefetchedFollowing=null) => {

    const { data: followingCount } = useSWR(
        address ? [`/api/follow/followingCount`, address] : null,
        fetchWithAddress,
        { fallbackData: prefetchedFollowingCount }
    )

    const { data: following } = useSWR(
        address ? [`/api/follow/following`, address] : null,
        fetchWithAddress,
        { fallbackData: prefetchedFollowing }
    )

    return [followingCount?.count, following?.following];
}