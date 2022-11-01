
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import RedditIcon from "@mui/icons-material/Reddit";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import TwitterIcon from "@mui/icons-material/Twitter";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { grey } from "@mui/material/colors";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import Head from "next/head"
import { useState } from "react";

import { TikTokIcon } from "../components/TikTokIcon";

export default function LoginPage({ hasReadPermission }) {
    const [password, setPassword] = useState("")

    return (
        <>
            <Head>
                <title>{hasReadPermission ? 'Logout' : 'Login'}</title>
                <meta name="robots" content="noindex" />
            </Head>
            <div style={{
                display: 'flex',
                minHeight: '100vh',
                flexDirection: 'column',
                boxSizing: 'border-box'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1,
                    boxSizing: 'border-box'
                }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                        <Box
                            component="span"
                            sx={{
                                fontFamily: theme => theme.logo.fontFamily,
                                fontSize: {
                                    xs: 35,
                                    sm: 40,
                                    md: 45
                                },
                                fontWeight: 600,
                                color: theme => theme.palette.primary.main,
                            }}>
                            Hodl My Moon

                        </Box>
                        <RocketLaunchIcon sx={{
                            marginLeft: 2,
                            color: grey[500],
                            fontSize: {
                                xs: 35,
                                sm: 40,
                                md: 45
                            },
                        }} />
                    </Box>
                    <Typography
                        sx={{
                            marginTop: 1,
                            marginBottom: 0,
                            fontFamily: theme => theme.logo.fontFamily,
                            fontSize: {
                                xs: 18,
                                sm: 20,
                            },
                            color: '#999',
                            textAlign: 'center'
                        }}>
                        A web3 social network and marketplace
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {hasReadPermission ?
                            <>
                                <Button
                                    sx={{
                                        paddingY: 1,
                                        paddingX: 3,
                                        fontSize: 16,
                                        margin: 6
                                    }}
                                    color="secondary"
                                    variant="contained"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.cookie = `${process.env.NEXT_PUBLIC_HODL_MY_MOON_PASSWORD_COOKIE_NAME}=; max-age=; path=`;
                                        window.location.href = "/login";
                                    }}
                                >
                                    Logout
                                </Button>
                            </>
                            :
                            <Box
                                sx={{
                                    padding: 0,
                                    textAlign: 'center'
                                }}>
                                <Box
                                    sx={{
                                        padding: 4
                                    }}
                                >
                                    <form>
                                        <Box
                                            sx={{ display: 'flex', flexDirection: 'column' }}
                                        >
                                            <TextField
                                                sx={{
                                                    background: 'white',
                                                    width: {
                                                        xs: 300,
                                                    },
                                                    marginBottom: 2,
                                                }}
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <div>
                                                <Button
                                                    sx={{
                                                        marginX: 2,
                                                        paddingY: 1,
                                                        paddingX: 3,
                                                        fontSize: 16
                                                    }}
                                                    variant="contained"
                                                    color="secondary"
                                                    type="submit"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        document.cookie = `${process.env.NEXT_PUBLIC_HODL_MY_MOON_PASSWORD_COOKIE_NAME}=${password}; max-age=${60 * 60 * 24 * 7}; path=/`;
                                                        window.location.href = "/";
                                                    }}
                                                >
                                                    Login
                                                </Button>
                                            </div>
                                        </Box>
                                    </form>
                                </Box>
                            </Box>
                        }
                    </Box>
                </Box>
                {!hasReadPermission && <Box sx={{
                    display: 'flex',
                    width: `100%`,
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#f6f6f6',
                    boxSizing: 'border-box',
                    paddingY: 3
                }}>
                    <Link href="https://twitter.com/hodlmymoon">
                        <TwitterIcon
                            sx={{
                                marginX: { xs: 1, sm: 2 },
                                fontSize: 22,
                                color: grey[500]
                            }} />
                    </Link>
                    <Link href="https://www.tiktok.com/@hodlmymoon">
                        <Box
                            sx={{
                                marginX: { xs: 1, sm: 2 },
                                width: 22,
                                height: 22
                            }}>
                            <TikTokIcon
                                color={grey[500]}
                            />
                        </Box>
                    </Link>
                    <Link href="https://www.reddit.com/user/hodlmymoon1">
                        <RedditIcon
                            sx={{
                                marginX: { xs: 1, sm: 2 },
                                fontSize: 22,
                                color: grey[500]
                            }} />
                    </Link>
                    <Link href="https://www.facebook.com/people/Hodlmymoon/100086969439067/">
                        <FacebookIcon
                            sx={{
                                marginX: { xs: 1, sm: 2 },
                                fontSize: 22,
                                color: grey[500]
                            }} />
                    </Link>
                    <Link href="https://www.instagram.com/hodlmymoon/">
                        <InstagramIcon
                            sx={{
                                marginX: { xs: 1, sm: 2 },
                                fontSize: 22,
                                color: grey[500]
                            }} />
                    </Link>
                </Box>
                }
            </div>
        </>
    )
}
