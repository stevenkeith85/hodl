import { useContext, useEffect, useState } from "react";
import { useUser } from '../../hooks/useUser';
import dynamic from 'next/dynamic';
import Box from "@mui/material/Box";
import { SignedInContext } from "../../contexts/SignedInContext";
import Link from "next/link";

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

    const [nicknameModalOpen, setNicknameModalOpen] = useState(false);
    const [profilePictureModalOpen, setProfilePictureModalOpen] = useState(false);

    const { signedInAddress } = useContext(SignedInContext);
    const { data: user } = useUser(signedInAddress);

    const [pages, setPages] = useState([
        { title: "Create", url: '/create' },
        { title: "Profile", url: '#' },
        { title: "Transactions", url: '/transactions' }
    ])

    useEffect(() => {
        if (user) {
            setPages([
                { title: "Create", url: '/create' },
                { title: "Profile", url: `/profile/${user.nickname || user.address}` },
                { title: "Transactions", url: '/transactions' }
            ])
        }
    }, [user])

    const [actions] = useState([
        {
            title: 'Nickname',
            action: () => setNicknameModalOpen(true),
        },
        {
            title: 'Avatar NFT',
            action: () => setProfilePictureModalOpen(true),
        },
    ]);



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
                {pages.map(({ title, url }) =>
                    <Link
                        href={url}
                        key={url}
                    >
                        <Box
                            sx={{
                                color: theme => theme.palette.text.secondary,
                                fontSize: 16,
                                margin: 1,
                                '&:hover': {
                                    color: "secondary.main",
                                    cursor: 'pointer'
                                }
                            }}>
                            {title}
                        </Box>
                    </Link>
                )}
                {actions.map(({ title, action }) => (
                    <Box
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();

                            action();
                        }}
                        sx={{
                            color: theme => theme.palette.text.secondary,
                            fontSize: 16,
                            margin: 1,
                            '&:hover': {
                                color: "secondary.main",
                                cursor: 'pointer'
                            }
                        }}>
                        {title}
                    </Box>
                ))}
            </Box>
        </>)
}
