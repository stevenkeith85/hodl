import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { WalletContext } from '../../contexts/WalletContext';
import { useUser } from '../../hooks/useUser';
import dynamic from 'next/dynamic';
import { WalletDetails } from '../WalletDetails';
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";

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
    const [pages] = useState([
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
        {
            label: 'Learn',
            action: () => router.push('/learn'),
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

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                <Box sx={{
                    marginBottom: 2
                }}>
                    <WalletDetails />
                </Box>
                {pages.map((page, i) => (
                    <Box
                        key={i}
                        onClick={e => {
                            e.stopPropagation();
                            page.action();
                        }}
                    >
                        <Box
                            sx={{
                                fontSize: 16,
                                margin: 1,
                                '&:hover': {
                                    color: "secondary.main",
                                    cursor: 'pointer'
                                }
                            }}>
                            {page.label}
                        </Box>
                    </Box>
                ))}
            </Box>
        </>)
}
