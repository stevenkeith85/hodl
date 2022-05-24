import { styled, alpha } from '@mui/material/styles';
import { Formik, Form, Field } from 'formik';
import { InputBase } from 'formik-mui';
import { useRouter } from 'next/router';
import SearchIcon from '@mui/icons-material/Search';
import { SearchValidationSchema } from '../validationSchema/search';

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
    color: 'inherit',
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


export const SearchBox = ({ closeMenu = null, sx = null }) => {
    const router = useRouter();

    return (
        <Formik
            initialValues={{
                q: router?.query?.q || ''
            }}
            validationSchema={SearchValidationSchema}
            onSubmit={async (values) => {
                if (closeMenu) {
                    closeMenu();
                }
                router.push(`/search?q=${values.q}`);
            }}
        >
            {({ setFieldValue, errors, values }) => (
                <Form>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <Field
                            sx={{ 
                                width: '100%', 
                                border: errors.q && values.q ? theme => `1px solid ${theme.palette.secondary.main}` : theme => `1px solid #ccc`, 
                                borderRadius: 1, 
                                input: {
                                    caretColor: 'white',
                                    cursor: 'pointer'
                                },
                                ...sx 
                            }}
                            component={StyledInputBase}
                            name="q"
                            type="text"
                            label="Search..."
                            onClick={e => {
                                e.stopPropagation();
                                // setSearchOpen(old => !old)
                            }}
                            onChange={e => {
                                const value = e.target.value || "";
                                setFieldValue('q', value.toLowerCase());
                            }}
                            autoComplete='off'
                        />
                        {/* { errors.q} */}
                    </Search>
                </Form>
            )}
        </Formik>
    )
}