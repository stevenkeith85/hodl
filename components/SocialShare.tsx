import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import RedditIcon from '@mui/icons-material/Reddit';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Card, CardContent, Link, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

const ShareLink = ({icon, href}) => (
    <Link href={href} target="_blank" sx={{ color: grey[500], '&:hover': { color: grey[700]}}}>
        {icon }
    </Link>
)

export const SocialShare = () => {
    
    const shareToTwitterUrl = 'https://twitter.com/intent/tweet?text==This%20is%20some%20%23text%20on%20%40twitter%20www.twitter.com';
    

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography sx={{marginBottom: 2}} variant="h6" component="div">
                    Share
                </Typography>
                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap'}}>
                    <ShareLink href={shareToTwitterUrl} icon={<TwitterIcon fontSize="large" />} />                    
                    <ShareLink href={shareToTwitterUrl} icon={<FacebookIcon fontSize="large" />} />
                    <ShareLink href={shareToTwitterUrl} icon={<InstagramIcon fontSize="large" />} />
                    <ShareLink href={shareToTwitterUrl} icon={<PinterestIcon fontSize="large" />} />
                    <ShareLink href={shareToTwitterUrl} icon={<RedditIcon fontSize="large" />} />
                    <ShareLink href={shareToTwitterUrl} icon={<LinkedInIcon fontSize="large" />} />
                </Stack>
            </CardContent>
        </Card>
    )
}