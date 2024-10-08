import Box from "@mui/material/Box";
import Link from "next/link";

export const insertTagLinks = (text) => {
    if (!text) {
        return null;
    }

    const parsed = [...text.matchAll(/#([\d\w_]+)/g)].map(x => ({
        index: x.index,
        hash: x[0],
        tag: x[1]
    }));

    const jsx = [];

    let lastPosition = 0;

    if (parsed.length === 0) { // no tags found
        return [text]
    }

    for (const { index, hash, tag } of parsed) {
        jsx.push(text.slice(lastPosition, index));
        jsx.push(
            <Link href={`/explore?q=${tag}`} key={tag}>
                <Box
                    component="span"
                    color="primary"
                    sx={{
                        textDecoration: 'none',
                        cursor: 'pointer'
                    }}>
                    {hash}
                </Box>
            </Link>);
        lastPosition = index + hash.length;
    }

    // in case there's any text at the end. e.g. "#guitar cover"
    jsx.push(text.slice(lastPosition));

    return jsx;
}

