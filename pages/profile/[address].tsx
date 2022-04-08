import { useEffect, useState } from 'react'
import { isValidAddress } from '../../lib/profile'
import { useContext } from 'react'
import { WalletContext } from '../_app'
import { Badge, Box, CircularProgress, Tab, Tabs} from '@mui/material'
import { useRouter } from 'next/router'

import { HodlImpactAlert } from '../../components/HodlImpactAlert'
import { HodlButton } from '../../components/HodlButton'

import { ProfileAvatar } from '../../components'
import { useFollow } from '../../hooks/useFollow'

import dynamic from 'next/dynamic'

const HodlingTab = dynamic(
   // @ts-ignore
  () => import('../../components/profile/HodlingTab').then((module) => module.HodlingTab),
  {loading: () => <CircularProgress />}
);

const ListedTab = dynamic(
   // @ts-ignore
  () => import('../../components/profile/ListedTab').then((module) => module.ListedTab),
  {loading: () => <CircularProgress />}
);

const FollowingTab = dynamic(
   // @ts-ignore
  () => import('../../components/profile/FollowingTab').then((module) => module.FollowingTab),
  {loading: () => <CircularProgress />}
);

const FollowersTab = dynamic(
   // @ts-ignore
  () => import('../../components/profile/FollowersTab').then((module) => module.FollowersTab),
  {loading: () => <CircularProgress />}
);


const Profile = () => {
  const router = useRouter();
  const { address } = useContext(WalletContext);
  const [value, setValue] = useState(0);  
  const [numberHodling, setNumberHodling] = useState();
  const [numberListed, setNumberListed] = useState();

  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);

  const [validAddress, setValidAddress] = useState(false);
  const [follow, isFollowing] = useFollow();
  
  // TODO: Move to Server Side?
  // @ts-ignore
  useEffect(async () => {
    const isValid = await isValidAddress(router.query.address);
    setValidAddress(isValid);

    if (router.query.address && !isValid) {
      const response = await fetch(`/api/address?nickname=${router.query.address}`);
      const result = await response.json();
      router.query.address = result.address;
      setValidAddress(true);
    }

    // For the following tab
    if (router.query.address) {
      const response = await fetch(`/api/following?address=${router.query.address}`);
      const result = await response.json();
      setFollowing(result.following);
    }

    // For the followers tab
    if (router.query.address) {
      const response = await fetch(`/api/followers?address=${router.query.address}`);
      const result = await response.json();
      setFollowers(result.followers);
    }
  }, [address, router.query.address]);
  
  useEffect(() => {
    setValue(0)// redirect to first tab on route change
  }, [router.asPath]);


  useEffect(() => {
    if (router.query.tab) {
      setValue(Number(router.query.tab)); // we want to send the user to the tab of interest. i.e. if they mint something they go to hodling. if they list something they go to listed
    }
  }, [router.query.tab]);


  if (!address && !router.query.address) {
    return <HodlImpactAlert title="Connect Wallet" message={"You need to connect your wallet to view your profile"} />
  }

  return (
    <>
   {validAddress && router?.query?.address &&
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyItems: "center", paddingTop: 2, paddingBottom: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 2, marginBottom: 2, alignItems: 'center'}}>
        <ProfileAvatar size="large" profileAddress={router?.query?.address || address } />
        {Boolean( address !== router.query.address) &&
        <HodlButton 
        sx={{
          paddingTop: 1,
          paddingBottom: 1,
          paddingLeft: 2,
          paddingRight: 2
        }}
        
        onClick={follow}>
          { isFollowing ? 'Unfollow' : 'Follow' }
        </HodlButton>
      }
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Tabs
            value={value}
            onChange={(e, v) => setValue(v)}
            textColor="secondary"
            indicatorColor="secondary"
          >
            <Tab value={0} label="Hodling" icon={ <Badge sx={{p: '6px 3px'}} showZero badgeContent={numberHodling}></Badge> } iconPosition="end"/>
            <Tab value={1} label="Listed" icon={ <Badge sx={{p: '6px 3px'}} showZero badgeContent={numberListed}></Badge> } iconPosition="end"/>
            <Tab value={2} label="Following" icon={ <Badge sx={{p: '6px 3px'}} showZero badgeContent={following?.length}></Badge> } iconPosition="end"/>
            <Tab value={3} label="Followers" icon={ <Badge sx={{p: '6px 3px'}} showZero badgeContent={followers?.length} ></Badge> } iconPosition="end"/>
          </Tabs>
      </Box>
      <div hidden={value !== 0}>
        {/* @ts-ignore */}
        <HodlingTab setNumberHodling={setNumberHodling}/>
      </div>
      <div hidden={value !== 1}>
        {/* @ts-ignore */}
        <ListedTab setNumberListed={setNumberListed} />
      </div>
      <div hidden={value !== 2}>
        {/* @ts-ignore */}
        <FollowingTab address={address} following={following} />
      </div>
      <div hidden={value !== 3}>
        {/* @ts-ignore */}
        <FollowersTab address={address} followers={followers} />
      </div>
    </Box>
}
    </>
  )
}

export default Profile;
