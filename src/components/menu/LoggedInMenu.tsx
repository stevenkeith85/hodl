import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useUser } from '../../hooks/useUser';
import dynamic from 'next/dynamic';
import Box from "@mui/material/Box";
import { SignedInContext } from "../../contexts/SignedInContext";

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
            label: 'Create',
            action: () => router.push('/create'),
        },
        {
            label: 'Profile',
            action: () => router.push(`/profile/${user?.nickname ?? user?.address ?? '#'}`),
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
    const { signedInAddress } = useContext(SignedInContext);
    const { data: user } = useUser(signedInAddress);

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
                                color: theme => theme.palette.text.secondary,
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
