import Box from '@mui/material/Box';
import Link from 'next/link';


export const LoggedOutMenu = ({ }) => {
    const pages = [
        { title: "Home", url: '/' },
        { title: "Explore", url: '/explore' },
        { title: "Learn", url: '/learn' }
    ]

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {pages.map(({ title, url }) =>
                <Link
                    href={url}
                    key={url}
                >
                    <Box
                        sx={{
                            fontSize: 18,
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
        </Box>
    )
}
