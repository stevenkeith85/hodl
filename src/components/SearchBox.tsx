import { useRouter } from 'next/router';

import { styled, alpha, useTheme } from '@mui/material/styles';

import InputBase from '@mui/material/InputBase';

import { SearchValidationSchema } from '../validation/search';
import { useEffect, useState } from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { getAsString } from '../lib/getAsString';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('md')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));


export const SearchBox = ({
    setMobileSearchOpen = null,
    sx = null
}) => {
    const router = useRouter();
    const theme = useTheme();

    const [q, setQ] = useState('');
    const [valid, setValid] = useState(true);

    useEffect(() => {
        if(router?.query?.q) {
            setQ(getAsString(router?.query?.q))
        }
    }, [router?.query?.q])
    return (
        <form onSubmit={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (valid) {
                if (setMobileSearchOpen) {
                    setMobileSearchOpen(false);
                }
                router.push(`/explore?q=${q}`);
            }
        }}>
            <Search>
                <SearchIconWrapper>
                    <SearchIcon size={22} fill={theme.palette.primary.main} />
                </SearchIconWrapper>
                <StyledInputBase
                    sx={{
                        width: {
                            xs: '100%',
                            md: 'auto',
                        },
                        border: !valid ? theme => `1px solid ${theme.palette.secondary.main}` : `1px solid #ccc`,
                        borderRadius: 1,
                        ...sx
                    }}
                    type="text"
                    onClick={e => {
                        e.stopPropagation();
                    }
                    }
                    onChange={async (e) => {
                        const value = (e.target.value || "").toLowerCase();

                        setQ(value);
                        SearchValidationSchema.isValid({ q: value }).then(setValid);
                    }}
                    autoComplete='off'
                    value={q}
                />
            </Search>
        </form>
    )
}
