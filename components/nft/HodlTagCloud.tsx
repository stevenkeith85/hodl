import { Card, CardContent, Typography, Chip, Box, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import axios from 'axios';
import useSWR from "swr";
import { useContext, useRef } from "react";
import { WalletContext } from "../../contexts/WalletContext";
import { Formik, Form, Field } from "formik";
import { InputBase } from 'formik-mui';
import { AddTagValidationSchema } from "../../validationSchema/addTag";
import { MAX_TAGS_PER_TOKEN } from "../../lib/utils";
import { fetchWithToken } from "../../lib/swrFetchers";

export const HodlTagCloud = ({ nft, prefetchedTags }) => {
    const router = useRouter();
    const newTagRef = useRef();
    const { address } = useContext(WalletContext);

    const { data: tags, mutate: mutateTags } = useSWR(nft.tokenId ? [`/api/tags`, nft.tokenId] : null,
        fetchWithToken,
        {
            fallbackData: prefetchedTags
        }
    );

    const isOwner = () => Boolean(nft?.owner?.toLowerCase() === address?.toLowerCase());

    if (!isOwner() && tags.length === 0) {
        return null;
    }

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h3" sx={{ marginBottom: 2 }}>Tags</Typography>
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                }}>
                    {isOwner() ?
                        (tags || []).map(tag => <Chip key={tag}
                            label={tag}
                            onClick={async (values) => {
                                router.push(`/search?q=${tag}`);
                            }}
                            onDelete={async () => {
                                try {
                                    mutateTags(old => {
                                        return old.filter(t => t !== tag)
                                    },
                                        { revalidate: false });
                                    const r = await axios.delete(
                                        '/api/tags/delete',
                                        {
                                            headers: {
                                                'Accept': 'application/json',
                                                'Authorization': localStorage.getItem('jwt')
                                            },
                                            data: {
                                                tag,
                                                token: nft.tokenId
                                            },

                                        });
                                } catch (error) {
                                    mutateTags();
                                }
                            }} />)
                        : tags.map(tag => <Chip label={tag} key={tag} onClick={async _values => {
                            router.push(`/search?q=${tag}`);
                        }} />)
                    }

                    {isOwner() && tags.length < MAX_TAGS_PER_TOKEN &&
                        <Formik
                            initialValues={{
                                tag: '',
                                token: nft.tokenId
                            }}
                            validationSchema={AddTagValidationSchema}
                            onSubmit={async (values) => {
                                try {
                                    mutateTags(old => {
                                        console.log('old', old);
                                        return [...old, values.tag];
                                    }, { revalidate: false });
                                    const r = await axios.post(
                                        '/api/tags/add',
                                        {
                                            tag: values.tag,
                                            token: values.token
                                        },
                                        {
                                            headers: {
                                                'Accept': 'application/json',
                                                'Authorization': localStorage.getItem('jwt')
                                            }
                                        });

                                    setTimeout(() => {
                                        values.tag = '';
                                        // @ts-ignore
                                        newTagRef?.current?.focus();
                                    })

                                } catch (error) {
                                    mutateTags();
                                    values.tag = '';
                                    setTimeout(() => {
                                        // @ts-ignore
                                        newTagRef?.current?.focus();
                                    })

                                }
                            }}
                        >
                            {({ setFieldValue, errors }) => (<>
                                <Form>
                                    <Tooltip title={errors?.tag || ''}>
                                        <Field
                                            inputRef={newTagRef}
                                            component={InputBase}
                                            sx={{ width: '120px', border: errors.tag ? theme => `1px solid ${theme.palette.error.main}` : '1px solid #999', borderRadius: 2, paddingX: 2 }}
                                            placeholder="add new tag"
                                            name="tag"
                                            type="text"
                                            autoComplete='off'
                                            onChange={e => {
                                                const value = e.target.value || "";
                                                setFieldValue('tag', value.toLowerCase());
                                            }}
                                        />
                                    </Tooltip>
                                </Form>
                            </>
                            )}
                        </Formik>
                    }
                </Box>
            </CardContent>
        </Card>
    )
}