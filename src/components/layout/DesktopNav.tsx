import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import { useState } from "react";


export const DesktopNav = ({ address }) => {
    const [pages] = useState([
        {
            label: 'explore',
            url: '/explore',
            publicPage: true
        },
        {
            label: 'create',
            url: '/create',
            publicPage: false
        },
    ]);

    return (
        <>
            {pages.filter(p => p.publicPage || address).map((page, i) => (
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
                        <Button
                            variant="text"
                            color="inherit"
                            component="span"
                            sx={{
                                fontFamily: theme => theme.logo.fontFamily,
                                padding: '9px',
                                textAlign: 'center',
                            }}>{page.label}</Button>
                    </Box>
                </Link>
            ))}
        </>
    )
}