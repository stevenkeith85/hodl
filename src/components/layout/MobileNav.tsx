import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import { useState } from "react";

import { ExploreIcon } from '../icons/ExploreIcon';
import { AddCircleIcon } from '../icons/AddCircleIcon';
import IconButton from "@mui/material/IconButton";


export const MobileNav = ({ address }) => {
    const theme = useTheme();

    const [pages] = useState([
        {
            url: '/explore',
            icon: <ExploreIcon size={22} fill={theme.palette.primary.main} />,
            publicPage: true
        },
        {
            url: '/create',
            icon: <AddCircleIcon size={22} fill={theme.palette.primary.main} />,
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
                                width: 44,
                                height: 44,
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
