import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { WalletContext } from '../../contexts/WalletContext';
import { LoginLogoutButton } from "./LoginLogoutButton";
import { useUser } from '../../hooks/useUser';
import dynamic from 'next/dynamic';
import { WalletDetails } from '../WalletDetails';
import Typography from '@mui/material/Typography';

const NicknameModal = dynamic(
    () => import('../modals/NicknameModal').then(mod => mod.NicknameModal),
    {
        ssr: false,
        loading: () => null
    }
);

const ProfilePictureModal = dynamic(
    () => import('../modals/ProfilePictureModal').then(mod => mod.ProfilePictureModal),
    {
        ssr: false,
        loading: () => null
    }
);

export const LoggedInMenu = () => {
    const [walletPages] = useState([
        {
            label: 'Feed',
            action: () => router.push('/feed'),
        },
        {
            label: 'Explore',
            action: () => router.push('/explore'),

        },
        {
            label: 'Create',
            action: () => router.push('/create'),
        },
        {
            label: 'Profile',
            action: () => router.push(user?.nickname ? `/profile/${user.nickname}` : `/profile/${user.address}`),
        },
        {
            label: 'Nickname',
            action: () => setNicknameModalOpen(true),
        },
        {
            label: 'Avatar NFT',
            action: () => setProfilePictureModalOpen(true),
        },
        {
            label: 'Transactions',
            action: () => router.push('/transactions'),
        },
    ]);

    const [nicknameModalOpen, setNicknameModalOpen] = useState(false);
    const [profilePictureModalOpen, setProfilePictureModalOpen] = useState(false);

    const router = useRouter();
    const { address } = useContext(WalletContext);
    const { data: user } = useUser(address);

    if (!user) {
        return null;
    }

    return (
        <>
            <NicknameModal nicknameModalOpen={nicknameModalOpen} setNicknameModalOpen={setNicknameModalOpen}></NicknameModal>
            <ProfilePictureModal profilePictureModalOpen={profilePictureModalOpen} setProfilePictureModalOpen={setProfilePictureModalOpen}></ProfilePictureModal>

            <div style={{ display: 'flex', 'flexDirection': 'column' }}>
                <WalletDetails />
                <div style={{ padding: '8px 0 0 0' }}>
                    {walletPages.map((page, i) => (
                        <div
                            key={i}
                            onClick={e => {
                                e.stopPropagation();
                                page.action();
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 16,
                                    marginLeft: 2,
                                    marginY: 2,
                                    '&:hover': {
                                        color: "secondary.main",
                                        cursor: 'pointer'
                                    }
                                }}>
                                {page.label}
                            </Typography>
                        </div>
                    ))}
                </div>
                <LoginLogoutButton
                        variant='contained'
                        sx={{
                            marginLeft: 1,
                            marginTop: 4,
                            paddingY: 0.75,
                            paddingX: 3,
                        }}
                    />
            </div>
        </>)
}
