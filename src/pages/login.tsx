import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { grey } from "@mui/material/colors";

import Typography from "@mui/material/Typography";

import Head from "next/head"
import { useState } from "react";
import { HodlTextField } from "../components/formFields/HodlTextField";
import { RocketLaunchIcon } from "../components/icons/RocketLaunchIcon";

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
                    <div style={{ padding: '8px' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 0.5,
                                paddingTop: 0,
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
                            <div style={{ marginLeft: '12px' }}>
                                <RocketLaunchIcon fill={grey[500]} size={33} />
                            </div>
                        </Box>
                        <Typography
                            sx={{
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
                    </div>
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
                                <form>
                                    <Box
                                        sx={{ display: 'flex', flexDirection: 'column' }}
                                    >
                                        <HodlTextField type={'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
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
                        }
                    </Box>
                </Box>
            </div>
        </>
    )
}
