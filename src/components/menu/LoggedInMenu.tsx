// import DisplaySettingsOutlinedIcon from '@mui/icons-material/DisplaySettingsOutlined';
// import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
// import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
// import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';

import Button from '@mui/material/Button';

import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { WalletContext } from '../../contexts/WalletContext';
import { LoginLogoutButton } from "./LoginLogoutButton";
import { ProfileNameOrAddress } from "../avatar/ProfileNameOrAddress";
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
            label: 'profile',
            action: () => router.push(`/profile/${user?.nickname || user?.address}`)
        },
        {
            label: 'nickname',
            action: () => setNicknameModalOpen(true),
        },
        {
            label: 'avatar',
            action: () => setProfilePictureModalOpen(true),
        },
        {
            label: 'transactions',
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
                <div style={{ padding: '8px 0' }}>
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

                    <LoginLogoutButton
                        variant='outlined'
                        sx={{
                            marginLeft: 1,
                            marginTop: 2,
                            // marginLeft: -1,
                            paddingY: 0.75,
                            paddingX: 3,
                        }}
                    />
                </div>
            </div>
        </>)
}
