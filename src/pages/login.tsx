import { RocketLaunch } from "@mui/icons-material";
import { Box, Button, TextField, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import Head from "next/head"
import { useState } from "react";
import Cookies from "universal-cookie"


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
                // height: 800,
                paddingY: '200px'
            }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        margin: 2
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
                    gap: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 4,
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
                        <form>
                            <Box
                                sx={{ display: 'flex', gap: 2 }}
                            >
                                <TextField
                                    sx={{
                                        width: {
                                            xs: 200,
                                            sm: 300
                                        }
                                    }}
                                    label="Password"
                                    type="text"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button
                                    sx={{
                                        paddingY: 1,
                                        paddingX: 3,
                                        fontSize: 16
                                    }}
                                    color="secondary"
                                    variant="contained"
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
                    }
                </Box>
                {/* <Box>
                    <Box sx={{
                        display: 'flex',
                        gap: 4,
                        margin: '40px'
                    }}>
                        <Box>
                            <TwitterIcon
                                sx={{
                                    fontSize: 25,
                                    color: grey[500]
                                }} />
                        </Box>
                        <Box>
                            <Box sx={{ width: 25, height: 25 }}>
                                <TikTokIcon
                                    color={grey[500]}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box> */}
            </Box>
        </>
    )
}