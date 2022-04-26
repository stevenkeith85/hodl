import useSWR from 'swr';
import { fetchWithAddress } from '../lib/swrFetchers';

export const useFollowers = (address, prefetchedFollowersCount=null, prefetchedFollowers=null) => {
    const { data: followersCount } = useSWR(
        address ? [`/api/follow/followersCount`, address] : null,
        fetchWithAddress,
        { fallbackData: prefetchedFollowersCount }
    )

    const { data: followers } = useSWR(
        address ? [`/api/follow/followers`, address] : null,
        fetchWithAddress,
        { fallbackData: prefetchedFollowers }
    )

    return [followersCount?.count, followers?.followers];
}
