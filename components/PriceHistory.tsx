import { Card, CardContent, Typography, Stack } from "@mui/material"
import { getShortAddress } from "../lib/utils"


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export const PriceHistory = ({ priceHistory }) => {
    return (
        <Card variant="outlined">
            <CardContent sx={{ whiteSpace: 'pre-line', maxHeight: 500, overflowY: 'auto' }}>
                <Typography sx={{ marginBottom: 2 }}>Price History</Typography>
                <TableContainer>
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
                            {priceHistory.map(({ buyer, seller, price, timestamp }, i) => {
                                return (
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        key={i}>
                                        <TableCell size="small">{getShortAddress(buyer)}</TableCell>
                                        <TableCell size="small">{price} Matic</TableCell>
                                        <TableCell size="small">{getShortAddress(seller)}</TableCell>
                                        <TableCell size="small">{new Date(timestamp * 1000).toLocaleDateString()}</TableCell>

                                    </TableRow>
                                )
                            })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    )
}