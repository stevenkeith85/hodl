import { useFollowers } from "../../hooks/useFollowers";
import { UserLinksList } from "./UserLinksList";

export const FollowersList = ({address, limit, prefetchedFollowers}) => {
  const { swr: followers } = useFollowers(address, limit, prefetchedFollowers);

  return (
    <UserLinksList swr={followers} limit={limit} />
  )
}