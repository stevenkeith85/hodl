import { Card, CardContent, Typography, Stack, Link, Box } from "@mui/material"


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { getShortAddress } from "../../lib/utils";
import { HodlLink } from "../HodlLink";

export const PriceHistory = ({ priceHistory }) => {
    return (
        <Box
            sx={{ 
                whiteSpace: 'pre-line', 
                maxHeight: 500, 
                overflowY: 'auto',
                padding: 2,
                border: `1px solid #ddd`,
                borderRadius: 1
                }}>
            <Typography variant="h2" sx={{ marginBottom: 2 }}>History</Typography>
            {priceHistory.length === 0 && 'This NFT has not been traded before'}
            {priceHistory.length !== 0 && <TableContainer>
                <Table sx={{ marginX: '-10px' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell size="small">Buyer</TableCell>
                            <TableCell size="small">Paid</TableCell>
                            <TableCell size="small">To</TableCell>
                            <TableCell size="small">On</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {priceHistory.map(({ buyerNickname, buyerAddress, sellerNickname, sellerAddress, price, timestamp }, i) => {
                            return (
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    key={i}>
                                    <TableCell size="small">
                                        <HodlLink href={`/profile/${buyerNickname || buyerAddress}`}>
                                            {buyerNickname || getShortAddress(buyerAddress)}
                                        </HodlLink>
                                    </TableCell>
                                    <TableCell size="small">{price} Matic</TableCell>
                                    <TableCell size="small">
                                        <HodlLink href={`/profile/${sellerNickname || sellerAddress}`}>
                                            {sellerNickname || getShortAddress(sellerAddress)}
                                        </HodlLink>
                                    </TableCell>
                                    <TableCell size="small">{new Date(timestamp * 1000).toLocaleDateString()}</TableCell>

                                </TableRow>
                            )
                        })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            }
        </Box>
    )
}