import { messageToSign } from './messageToSign';

// This does Sign In With Ethereum
export const signIn = async (address, signer) => {
    const { default: axios } = await import('axios');
    const { uuid } = await axios.get(`/api/auth/uuid?address=${address}`).then(r => r.data);

    const signature = await signer.signMessage(messageToSign + uuid);

    const r = await axios.post(
        '/api/auth/login',
        {
            signature,
            address
        },
        {
            headers: {
                'Accept': 'application/json'
            },
        }
    );
}