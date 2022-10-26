import { useRouter } from 'next/router';

import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';

import InputBase from '@mui/material/InputBase';

import { SearchValidationSchema } from '../validation/search';
import { useState } from 'react';

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

    const [q, setQ] = useState('');
    const [valid, setValid] = useState(true);

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
                            <SearchIcon color="primary" />
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
                        placeholder="tag"
                        onClick={e => {
                            e.stopPropagation();
                        } 
                    }
                    onChange={async (e) => {
                        const value = (e.target.value || "").toLowerCase();

                        setQ(value);
                        SearchValidationSchema.isValid({ q: value }).then(setValid);
                    } }
                    autoComplete='off'                        
                    />
                    </Search>
                    </form>
    )
}
