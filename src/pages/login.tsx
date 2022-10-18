import { Facebook, Instagram, Reddit, RocketLaunch, Twitter } from "@mui/icons-material";
import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
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

    const [value, setValue] = useState(0);

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
                // paddingY: 10,
                height: `calc(100vh - 250px)`,
                background: '#fefefe'
            }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        // margin: 2
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
                    <RocketLaunch sx={{
                        marginX: 2,
                        color: grey[500],
                        fontSize: {
                            xs: 35,
                            sm: 40,
                            md: 45
                        },
                    }} />
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {loggedIn ?
                        <>
                            <Typography
                                sx={{
                                    fontSize: 20,
                                    color: theme => theme.palette.text.secondary
                                }}
                            >Thanks for testing!</Typography>
                            <Button
                                sx={{
                                    paddingY: 1,
                                    paddingX: 3,
                                    fontSize: 16
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
                                // background: '#f0f0f0',
                                padding: 0,
                                textAlign: 'center'
                                // border: '1px solid #ddd'
                            }}>
                            <Box
                                sx={{
                                    padding: 4
                                }}
                            >
                                <form>
                                    <Box
                                        sx={{ display: 'flex' }}
                                    >
                                        <TextField
                                            sx={{
                                                background: 'white',
                                                width: {
                                                    xs: 200,
                                                    sm: 300
                                                }
                                            }}
                                            placeholder="Early access password"
                                            type="text"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
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
                                </form>
                            </Box>
                        </Box>
                    }
                </Box>

            </Box>
            <Box
                sx={{
                    display: 'flex'
                }}>
                <Box sx={{
                    width: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '250px',
                    background: '#fafafa',
                    boxSizing: 'border-box'
                }}>
                    <Typography
                        mb={4}
                        sx={{
                            fontSize: 20,
                            color: theme => theme.palette.text.secondary
                        }}
                    >I'd like early access...</Typography>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <form
                            action="https://hodlmymoon.us9.list-manage.com/subscribe/post?u=ec30c975c5c1d85f780a863c0&amp;id=8528416789&amp;f_id=00f60fe1f0"
                            method="post"
                            target="_self">
                            <Box>
                                <TextField
                                    sx={{
                                        background: 'white',
                                        width: {
                                            xs: 200,
                                            sm: 300
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
                        </form>
                    </Box>

                </Box>

                <Box sx={{
                    display: 'flex',
                    width: '50%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '250px',
                    background: '#f6f6f6',
                    boxSizing: 'border-box'
                }}>
                    <Link href="https://twitter.com/hodlmymoon">
                        <Twitter
                            sx={{
                                marginX: 2,
                                fontSize: 44,
                                color: grey[500]
                            }} />
                    </Link>
                    <Link href="https://www.tiktok.com/@hodlmymoon">
                        <Box
                            sx={{
                                marginX: 2,
                                width: 44,
                                height: 44
                            }}>
                            <TikTokIcon
                                color={grey[500]}
                            />
                        </Box>
                    </Link>
                    <Link href="https://www.reddit.com/user/hodlmymoon1">
                        <Reddit
                            sx={{
                                marginX: 2,
                                fontSize: 44,
                                color: grey[500]
                            }} />
                    </Link>
                    <Link href="https://www.facebook.com/people/Hodlmymoon/100086969439067/">
                        <Facebook
                            sx={{
                                marginX: 2,
                                fontSize: 44,
                                color: grey[500]
                            }} />
                    </Link>
                    <Link href="https://www.instagram.com/hodlmymoon/">
                        <Instagram
                            sx={{
                                marginX: 2,
                                fontSize: 44,
                                color: grey[500]
                            }} />
                    </Link>
                </Box>
            </Box>
        </>
    )
}