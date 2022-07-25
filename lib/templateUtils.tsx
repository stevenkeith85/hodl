import { Chip, Typography } from "@mui/material";
import Link from "next/link";

export const insertTagLinks = (text) => {
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
            <Link href={`/search?q=${tag}`}>
                <Typography
                    color="primary"
                    component="a"
                    sx={{ 
                        textDecoration: 'none',
                        cursor: 'pointer'
                    }}>
                    {/* <Chip 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                            // background: '#f0f0f0', 
                            cursor: 'pointer',
                            '&:hover': {
                                // background: '#efefef', 
                            }
                        }} 
                        label={tag} 
                    /> */}
                    {hash}
                </Typography>
            </Link>);
        lastPosition = index + hash.length;
    }

    return jsx;
}