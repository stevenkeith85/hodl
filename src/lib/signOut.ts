
// This clears the user's session and cookies
export const signOut = async () => {
    const { default: axios } = await import('axios');

    const r = await axios.post(
        '/api/auth/logout',
        {
            headers: {
                'Accept': 'application/json',
            },
        }
    )
}