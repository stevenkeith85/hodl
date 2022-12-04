import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { HodlBorderedBox } from "../../components/HodlBorderedBox";
import { authenticate } from "../../lib/jwt";
import Head from "next/head";

export async function getServerSideProps({ req, res }) {
    await authenticate(req, res);

    return {
        props: {
            address: req.address || null,
        }
    }
}

export default function License({ address }) {
    return (
        <>
            <Head>
                <meta name="robots" content="noindex" />
            </Head>
            <Box marginX={2} marginY={4}>
                <HodlBorderedBox>
                    <Box mb={4}>
                        <Typography mb={1} sx={{ fontSize: 18, fontWeight: 500 }}>
                            Token Author License Agreement
                        </Typography>
                        <Typography
                            variant="h2"
                            mb={0}
                        >
                            Last Updated: September 2022
                        </Typography>
                    </Box>
                    <Box marginY={4}>
                        <Typography mb={1} color={theme => theme.palette.text.secondary} sx={{ fontSize: 16 }}>
                            This is a license agreement between the Token Author
                            and the Token Hodler that explains how the Token Hodler
                            can use any assets attached to a token they hodl; such as photos, illustrations, videos and music;
                            that they license from the Token Author.
                        </Typography>
                        <Typography mb={1} color={theme => theme.palette.text.secondary} sx={{ fontSize: 16 }}>
                            By minting or trading tokens on Hodl My Moon, you accept the terms of this agreement.
                        </Typography>
                    </Box>
                    <Box marginY={4}>
                        <Typography mb={1} color={theme => theme.palette.primary.main} sx={{ fontSize: 16 }}>
                            The Token Author must hold the intellectual property rights of the attached asset(s).
                        </Typography>
                    </Box>
                    <Box marginY={4}>
                        <Typography
                            variant="h2"
                            mb={2}
                        >
                            1. What types of licenses can Token Authors provide?
                        </Typography>
                        <Typography>
                            Token Authors can offer a Commercial or Non Commercial license for the asset attached to a token they mint.
                        </Typography>
                    </Box>
                    <Box marginY={4}>
                        <Typography variant="h2" mb={2}>
                            2. Commercial vs Non Commercial
                        </Typography>
                        <Typography
                            sx={{
                                // fontSize: 18,
                                span: {
                                    color: theme => theme.palette.primary.main
                                }
                            }}
                            marginY={1}
                        >
                            <span>Commercial</span> means something is primarily intended for or directed toward commercial advantage or monetary compensation.
                        </Typography>
                        <Typography
                            sx={{
                                // fontSize: 18,
                                span: {
                                    color: theme => theme.palette.primary.main
                                }
                            }}
                            marginY={1}
                        >
                            <span>Non Commercial</span> means something is not primarily intended for, or directed towards, commercial advantage or monetary compensation.
                        </Typography>
                        <Typography
                            sx={{
                                span: {
                                    color: theme => theme.palette.primary.main
                                }
                            }}
                            marginY={1}
                        >
                            A <span>Non Commercial</span> license indicates that the Token Author primarily intends the asset to be used in a non commercial manner.
                        </Typography>
                        <Typography
                            sx={{
                                // fontSize: 18,
                                span: {
                                    fontWeight: 600
                                }
                            }}
                            marginTop={2}
                            marginBottom={1}
                        >
                            Examples of how you can use Non Commercially licensed assets include:
                        </Typography>
                        <Typography component="ul">
                            <Typography component="li" mb={1}>
                                Use in free educational lectures and classes
                            </Typography>
                            <Typography component="li" mb={1}>
                                Use on an individual or group&apos;s website discussing the artwork in question
                            </Typography>
                            <Typography component="li" mb={1}>
                                Use on websites that are primarily information-led, research-oriented and obviously non-commercial in nature
                            </Typography>
                        </Typography>
                    </Box>
                    <Box marginY={4}>
                        <Typography
                            variant="h2"
                            mb={2}
                        >
                            3. Expiration of the license
                        </Typography>
                        <Typography
                            sx={{
                                // fontSize: 18,
                                span: {
                                    fontWeight: 600
                                }
                            }}
                        // marginY={1}
                        >
                            When the token is transferred, the license moves with the token.
                            That is, previous Token Hodlers do not retain a license.
                            Only the current hodler of a token is granted a license.
                        </Typography>
                    </Box>
                    <Box marginY={4}>
                        <Typography
                            variant="h2"
                            mb={2}
                        >
                            4. How can a Token Hodler use licensed content?
                        </Typography>
                        <Typography
                            sx={{
                                // fontSize: 18,
                                span: {
                                    fontWeight: 600
                                }
                            }}
                            marginY={1}
                        >
                            A Token Hodler can use the asset in any way that is not restricted (see Restricted Uses below)
                        </Typography>
                        <Typography
                            sx={{
                                // fontSize: 18,
                                span: {
                                    fontWeight: 600
                                }
                            }}
                            marginY={1}
                        >
                            Subject to those restrictions and the rest of the terms of this agreement, the rights granted to a Token Hodler by the Token Author are:
                        </Typography>
                        <Typography
                            sx={{
                                span: {
                                    color: theme => theme.palette.primary.main
                                }
                            }}
                            marginY={1}
                        >
                            <span>Perpetual</span>, meaning there is no expiration or end date on the Token Hodler&apos;s rights to use the attached asset whilst they continue to hodl the token.
                        </Typography>
                        <Typography
                            sx={{
                                span: {
                                    color: theme => theme.palette.primary.main
                                }
                            }}
                            marginY={1}
                        >
                            <span>Non-exclusive</span>, meaning that the Token Hodler does not have exclusive rights to use the attached asset. Token Authors can license the same asset to other parties.
                        </Typography>
                        <Typography
                            sx={{
                                span: {
                                    color: theme => theme.palette.primary.main
                                }
                            }}
                            marginY={1}
                        >
                            <span>Non-sublicensable</span>, meaning that the Token Hodler can not sub-license usage of the asset to other parties.
                            A license agreement only exists between the Token Author and the Token Hodler.
                        </Typography>
                        <Typography
                            sx={{
                                span: {
                                    color: theme => theme.palette.primary.main
                                }
                            }}
                            marginY={1}
                        >
                            <span>Worldwide</span>, meaning the asset can be used in any geographic territory.
                        </Typography>
                        <Typography
                            sx={{
                                span: {
                                    color: theme => theme.palette.primary.main
                                }
                            }}
                            marginY={1}
                        >
                            <span>Unlimited</span>, meaning the Token Hodler can use the asset in an unlimited number of projects and in any media whilst they continue to hodl the token.
                        </Typography>
                        <Typography
                            sx={{
                                // fontSize: 18,
                                span: {
                                    fontWeight: 600
                                }
                            }}
                            mb={1}
                        >
                            For purposes of this agreement, &quot;use&quot; means to copy, reproduce, modify, edit, synchronize, perform, display, broadcast, publish, or otherwise make use of.
                        </Typography>
                        <Typography
                            sx={{
                                // fontSize: 18,
                                span: {
                                    fontWeight: 600
                                }
                            }}
                        // marginY={4}
                        >
                            In addition to the above, the following applies to Music assets:
                        </Typography>
                        <Typography
                            sx={{
                                // fontSize: 18,
                                span: {
                                    fontWeight: 600
                                }
                            }}
                            marginY={2}
                        >
                            A Token Hodler can edit Music assets provided that any such change
                            <ol>
                                <li>shall not alter the fundamental character of the portion of the Master being used, and</li>
                                <li>shall not give rise to any ownership rights or claims, including copyright,
                                    on your part in or to the resultant edited recording or composition.</li>
                            </ol>
                        </Typography>
                        <Typography
                            sx={{
                                // fontSize: 18,
                                span: {
                                    fontWeight: 600
                                }
                            }}
                            marginY={1}
                        >
                            Examples of how you can use licensed content include:
                        </Typography>
                        <Typography
                            sx={{
                                // fontSize: 18,
                                span: {
                                    fontWeight: 600
                                }
                            }}
                        // marginY={4}
                        >
                            <ul>
                                <li>websites</li>
                                <li>blog posts</li>
                                <li>social media</li>
                                <li>advertisements</li>
                                <li>newspapers</li>
                                <li>magazines</li>
                                <li>books</li>
                                <li>multimedia productions</li>
                                <li>web and mobile applications</li>
                            </ul>
                        </Typography>
                        <Typography
                        >
                            Ensure you read the Restricted Uses section below for exceptions.
                        </Typography>
                    </Box>
                    <Box marginY={4}>
                        <Typography
                            variant="h2"
                            mb={2}
                        >
                            5. Restricted Uses
                        </Typography>
                        <Typography
                            sx={{
                                span: {
                                    color: theme => theme.palette.primary.main
                                }
                            }}
                            marginY={1}
                        >
                            <span>No Commercial Activities with a &quot;Non Commercial&quot; license. </span>
                            The Token Hodler may not use the asset for commercial purposes if the asset is provided under a non commercial license.
                        </Typography>
                        <Typography
                            sx={{
                                span: {
                                    color: theme => theme.palette.primary.main
                                }
                            }}
                            marginY={1}
                        >
                            <span>No Use in Trademark or Logo. </span>
                            The Token Hodler may not use the asset (in whole or in part) as the distinctive or distinguishing feature of a trademark or logo.
                        </Typography>
                        <Typography
                            sx={{
                                span: {
                                    color: theme => theme.palette.primary.main
                                }
                            }}
                            marginY={1}
                        >
                            <span>No Unlawful Use. </span>
                            The Token Hodler may not use the asset in a pornographic, defamatory or other unlawful manner, to promote violence or hatred, or in violation of any applicable regulations or industry codes.
                        </Typography>
                        <Typography
                            sx={{
                                span: {
                                    color: theme => theme.palette.primary.main
                                }
                            }}
                            marginY={1}
                        >
                            <span>No Sensitive Use. </span>
                            The Token Hodler may not use the asset in <span>obviously</span> unflattering or controversial material (for example, sexually transmitted diseases advertisements),
                            without obtaining explicit consent from the Token Author.
                        </Typography>
                        <Typography
                            sx={{
                                span: {
                                    color: theme => theme.palette.primary.main
                                }
                            }}
                            marginY={1}
                        >
                            <span>No Political Campaigns. </span>
                            The Token Hodler may not use the asset in a political campaign without obtaining explicit consent from the Token Author.
                        </Typography>
                    </Box>
                    <Box id="intellectual-property" marginY={4}>
                        <Typography
                            variant="h2"
                            marginY={2}
                        >
                            6. Intellectual Property</Typography>
                        <Typography
                            sx={{
                                // fontSize: 18,
                                span: {
                                    fontWeight: 600
                                }
                            }}
                            marginY={1}
                        >
                            The Token Author must own the intellectual property of the attached asset. Licensing the use of their asset to the Token Hodler does not transfer
                            the intellectual property of the asset.
                        </Typography>
                    </Box>
                    <Box id="termination" marginY={4}>
                        <Typography
                            variant="h2"
                            marginY={2}
                        >
                            7. Termination</Typography>
                        <Typography
                            sx={{
                                // fontSize: 18,
                                span: {
                                    fontWeight: 600
                                }
                            }}
                            marginY={1}
                        >
                            This license agreemnent is only in effect for the Token Hodler whilst they hodl the token.
                            <ul>
                                <li>If the token is transferred, the license moves with the token; and the ex-hodler of the token should cease their usage of the attached asset. </li>
                                <li>If the token is burned the license is null and void.</li>
                            </ul>
                        </Typography>
                    </Box>
                    <Box id="Indemnification" marginY={4}>
                        <Typography
                            variant="h2"
                            marginY={2}
                        >
                            8. Indemnification</Typography>
                        <Typography>
                            The Token Hodler (past and present),
                            and the Token Author agree to defend, indemnity and hold harmless Hodl My Moon (the brand), Pony Powered Limited (the company), its staff and directors from all damages, liabilities and expenses
                            including reasonable legal costs including attorney fees) arising out of or in connection with any breach or alleged breach by you (or anyone acting on your behalf) of any of the terms of this agreement.
                        </Typography>
                    </Box>
                    <Box id="General Provisions" marginY={4}>
                        <Typography
                            variant="h2"
                            marginY={2}
                        >
                            9. General Provisions</Typography>
                        <Typography
                            sx={{
                                span: {
                                    color: theme => theme.palette.primary.main
                                }
                            }}
                            marginY={1}
                        >
                            <span>Hodl My Moon Fair Usage</span> - The Token Author grants Hodl My Moon a commercial license for the asset. Usage will be limited to activities concerned with Hodl My Moon. (the website, apps, etc)
                        </Typography>
                        <Typography
                            sx={{
                                span: {
                                    color: theme => theme.palette.primary.main
                                }
                            }}
                            marginY={1}
                        >
                            <span>Taxes</span> - The Token Author and Token Hodler agree to pay and be responsible for any and all taxes
                            imposed by any jurisdiction as the result of trading tokens or crypto assets.
                        </Typography>
                    </Box>
                    <Box id="glossary" marginY={4}>
                        <Typography
                            variant="h2"
                            marginY={2}
                        >
                            10. Glossary of Crypto Terms</Typography>
                        <Typography
                            sx={{
                                span: {
                                    color: theme => theme.palette.primary.main
                                }
                            }}
                            marginY={1}
                        >
                            A <span>blockchain</span> is a distributed ledger that is shared amongst the nodes of a computer network.
                            It maintains a secure and decentralized record of transactions.
                        </Typography>
                        <Typography
                            sx={{
                                span: {
                                    color: theme => theme.palette.primary.main
                                }
                            }}
                            marginY={1}
                        >
                            A <span>token</span> is a representation of something in the blockchain.
                            This something can be anything. By representing things as tokens, we can allow smart contracts to interact with them.
                            Tokens often link to assets such as images, illustractions, videos, or music that do not reside on the blockchain.
                        </Typography>
                        <Typography
                            sx={{
                                span: {
                                    color: theme => theme.palette.primary.main
                                }
                            }}
                            marginY={1}
                        >
                            A <span>smart contract</span> is an executable piece of code that runs on the blockchain.
                        </Typography>
                        <Typography
                            sx={{
                                span: {
                                    color: theme => theme.palette.primary.main
                                }
                            }}
                            marginY={1}
                        >
                            <span>Mint(ing)</span> is the process of creating a token using a smart contract.
                        </Typography>
                        <Typography
                            sx={{
                                span: {
                                    color: theme => theme.palette.primary.main
                                }
                            }}
                            marginY={1}
                        >
                            <span>Token Author</span> refers to the party that minted the token.
                        </Typography>
                        <Typography
                            sx={{
                                span: {
                                    color: theme => theme.palette.primary.main
                                }
                            }}
                            marginY={1}
                        >
                            <span>Token Hodler</span> refers to the party that currently owns the token.
                        </Typography>
                        <Typography
                            sx={{
                                span: {
                                    color: theme => theme.palette.primary.main
                                }
                            }}
                            marginY={1}
                        >
                            To <span>hodl</span> means to own a token.
                        </Typography>
                    </Box>
                </HodlBorderedBox >
            </Box >
        </>
    )
}