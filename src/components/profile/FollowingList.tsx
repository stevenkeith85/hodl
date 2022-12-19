import { useFollowing } from "../../hooks/useFollowing";
import { UserLinksList } from "./UserLinksList";


export const FollowingList = ({address, limit, prefetchedFollowing}) => {
  const { swr: following } = useFollowing(address, limit, prefetchedFollowing);

  return (
    <UserLinksList swr={following} limit={limit} />
  )
}