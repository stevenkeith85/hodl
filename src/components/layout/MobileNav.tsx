import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ExploreIcon } from '../icons/ExploreIcon';
import { AddCircleIcon } from '../icons/AddCircleIcon';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import IconButton from "@mui/material/IconButton";
import { useUser } from "../../hooks/useUser";


export const MobileNav = ({ address }) => {
    const theme = useTheme();

    const { data: user } = useUser(address);

    useEffect(() => {
        if (user?.nickname) {
            setPages([
                {
                    icon: <ExploreIcon size={20} fill={theme.palette.primary.main} />,
                    url: '/explore',
                    publicPage: true
                },
                {
                    icon: <AddCircleIcon size={20} fill={theme.palette.primary.main} />,
                    url: '/create',
                    publicPage: false
                },
                {
                    icon: <AccountCircleIcon sx={{fontSize:20}} />,
                    url: `/profile/${user?.nickname}`,
                    publicPage: false
                },
            ])
        }
    }, [user?.nickname])

    const [pages, setPages] = useState([
        {
            icon: <ExploreIcon size={20} fill={theme.palette.primary.main} />,
            url: '/explore',
            publicPage: true
        },
        {
            icon: <AddCircleIcon size={20} fill={theme.palette.primary.main} />,
            url: '/create',
            publicPage: false
        },
        {
            icon: <AccountCircleIcon sx={{fontSize:20}} />,
            url: `/profile/${address}`,
            publicPage: false
        },
    ]);


    return (
        <>{
            pages.filter(p => p.publicPage || address).map((page, i) => (
                <Link key={page.url} href={page.url}>
                    <Box
                        sx={{
                            color: theme => theme.palette.primary.main,
                            cursor: 'pointer',
                            textDecoration: 'none',
                            margin: 0,
                            padding: 0,
                            lineHeight: 0,
                        }}
                    >
                        <IconButton
                            sx={{
                                margin: 0,
                                padding: 0,
                                lineHeight: 0,
                                width: 40,
                                height: 40,
                            }}
                            color="inherit"
                        >
                            {page.icon}
                        </IconButton>
                    </Box>
                </Link>
            ))}
        </>
    )
}
