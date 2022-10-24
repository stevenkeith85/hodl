
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
import Cookies from "universal-cookie"

import { TikTokIcon } from "../components/TikTokIcon";

export async function getServerSideProps({ req, res }) {
    const cookies = new Cookies(req.headers.cookie);
    const password = cookies.get(process.env.NEXT_PUBLIC_HODL_MY_MOON_PASSWORD_COOKIE_NAME) ?? ""

    return {
        props: {
            loggedIn: password === process.env.HODL_MY_MOON_PASSWORD
        }
    }
}

export default function LoginPage({ loggedIn }) {
    const [password, setPassword] = useState("")

    return (
        <>
            <Head>
                <title>{loggedIn ? 'Logout' : 'Login'}</title>
                <meta name="robots" content="noindex" />
            </Head>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: { xs: `calc(100vh - 500px)`, sm: `calc(100vh - 250px)` },
                minHeight: 'max(70vh, 450px)',
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
                    {loggedIn ?
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
                                    const cookies = new Cookies();
                                    cookies.remove(process.env.NEXT_PUBLIC_HODL_MY_MOON_PASSWORD_COOKIE_NAME, { path: "/" });
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
                                            placeholder="early access password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <Box>
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
                                                    const cookies = new Cookies();
                                                    cookies.set(process.env.NEXT_PUBLIC_HODL_MY_MOON_PASSWORD_COOKIE_NAME, password, {
                                                        path: "/",
                                                    });
                                                    window.location.href = "/";
                                                }}
                                            >
                                                Login
                                            </Button>
                                        </Box>
                                    </Box>
                                </form>
                            </Box>
                        </Box>
                    }
                </Box>
            </Box>
            {!loggedIn && <Box
                sx={{
                    display: 'flex',
                    flexDirection: {
                        xs: 'column',
                        sm: 'row'
                    }
                }}>
                <Box sx={{
                    width: { xs: '100%%', sm: '50%' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '250px',
                    background: '#fafafa',
                    boxSizing: 'border-box'
                }}>
                    <Typography
                        mb={2}
                        sx={{
                            fontSize: 20,
                            color: theme => theme.palette.text.secondary
                        }}
                    >I&apos;d like early access...</Typography>
                    <Box>
                        <form
                            action="https://hodlmymoon.us9.list-manage.com/subscribe/post?u=ec30c975c5c1d85f780a863c0&amp;id=8528416789&amp;f_id=00f60fe1f0"
                            method="post"
                            target="_self">
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}>
                                <TextField
                                    sx={{
                                        marginBottom: 2,
                                        background: 'white',
                                        width: {
                                            maxWidth: '90%',
                                            xs: 300,
                                        }
                                    }}
                                    placeholder="person@example.com"
                                    type="email"
                                    name="EMAIL"
                                />
                                <Box sx={{
                                    display: 'none'
                                }}>
                                    <input
                                        type="text"
                                        name="b_ec30c975c5c1d85f780a863c0_8528416789"
                                        value=""
                                    />
                                </Box>
                                <Box>
                                    <Button
                                        sx={{
                                            marginX: 2,
                                            paddingY: 1.25,
                                            paddingX: 3,
                                            fontSize: 16
                                        }}
                                        color="info"
                                        variant="outlined"
                                        type="submit"
                                        name="subscribe"
                                    >
                                        Submit
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    </Box>

                </Box>
                <Box sx={{
                    display: 'flex',
                    width: { xs: '100%', sm: '50%' },
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '250px',
                    background: '#f6f6f6',
                    boxSizing: 'border-box'
                }}>
                    <Link href="https://twitter.com/hodlmymoon">
                        <TwitterIcon
                            sx={{
                                marginX: { xs: 1, sm: 2 },
                                fontSize: 30,
                                color: grey[500]
                            }} />
                    </Link>
                    <Link href="https://www.tiktok.com/@hodlmymoon">
                        <Box
                            sx={{
                                marginX: { xs: 1, sm: 2 },
                                width: 30,
                                height: 30
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
                                fontSize: 30,
                                color: grey[500]
                            }} />
                    </Link>
                    <Link href="https://www.facebook.com/people/Hodlmymoon/100086969439067/">
                        <FacebookIcon
                            sx={{
                                marginX: { xs: 1, sm: 2 },
                                fontSize: 30,
                                color: grey[500]
                            }} />
                    </Link>
                    <Link href="https://www.instagram.com/hodlmymoon/">
                        <InstagramIcon
                            sx={{
                                marginX: { xs: 1, sm: 2 },
                                fontSize: 30,
                                color: grey[500]
                            }} />
                    </Link>
                </Box>
            </Box>}
        </>
    )
}