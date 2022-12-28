import Box from "@mui/material/Box";
import Link from "next/link";
import { getShortAddress } from "./getShortAddress";


export const insertProfileLinks = (text) => {
    if (!text) {
        return null;
    }

    // find the addresses and turn them into links
    const parsed = [...text.matchAll(/0x[0-9A-F]{40}/ig)].map(x => ({
        index: x.index,
        address: x[0],
    }));

    const jsx = [];

    let lastPosition = 0;

    if (parsed.length === 0) { // no addresses found
        return [text];
    }

    for (const { index, address } of parsed) {
        jsx.push(text.slice(lastPosition, index));
        jsx.push(
            <Link href={`/profile/${address}`} key={index}>
                <Box
                    component="span"
                    sx={{
                        textDecoration: 'none',
                        cursor: 'pointer',
                        color: "primary.dark"
                    }}>
                    {getShortAddress(address)}
                </Box>
            </Link>);
        lastPosition = index + address.length;
    }

    // the text after the addresses
    jsx.push(text.slice(lastPosition));

    return jsx;
};
