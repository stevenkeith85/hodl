import axios from 'axios';

export const addToZeplo = async (
    endpoint, 
    postData,
    refreshToken,
    accessToken,
    trace = '') => {
    try {
        const serverlessFunctionUrl = `https://${process.env.VERCEL_URL || process.env.MESSAGE_HANDLER_HOST}/${endpoint}`;
        const zeploUrl = `https://zeplo.to/${serverlessFunctionUrl}?secret=${process.env.ZEPLO_SECRET}&_token=${process.env.ZEPLO_TOKEN}&_trace=${trace}&_retry=1`;
        // const zeploUrl = `${serverlessFunctionUrl}?secret=${process.env.ZEPLO_SECRET}&_token=${process.env.ZEPLO_TOKEN}&_trace=${trace}&_retry=1`;

        const start = Date.now();

        const { data } = await axios.post(
            zeploUrl,
            postData,
            {
                headers: {
                    "Cookie": `refreshToken=${refreshToken}; accessToken=${accessToken}`
                },
            });

        const stop = Date.now()
        console.log('addingMessageToZeplo time taken', stop - start, endpoint);
        return true;
    } catch (e) {
        console.log('zeplo call failed', e.message);
        return false;
    }
}

export const queueTxAndAction = async (
    hash,
    refreshToken,
    accessToken) => {
    try {        
        const start = Date.now();

        const { data } = await axios.post(
            `https://zeplo.to/step?_token=${process.env.ZEPLO_TOKEN}`, [
                {
                    url: `https://${process.env.VERCEL_URL || process.env.MESSAGE_HANDLER_HOST}/api/blockchain/transaction?_step=A`,
                    headers: {
                        "Cookie": `refreshToken=${refreshToken}; accessToken=${accessToken}`
                    },
                    body: {
                        hash
                    }
                }, {
                    url: `https://${process.env.VERCEL_URL || process.env.MESSAGE_HANDLER_HOST}/api/actions/add?_requires=A`,
                    headers: {
                        "Cookie": `refreshToken=${refreshToken}; accessToken=${accessToken}`
                    },
                },
            ],
            {
                headers: {
                    "Cookie": `refreshToken=${refreshToken}; accessToken=${accessToken}`
                },
            });

        const stop = Date.now()
        console.log('addingStepsToZeplo time taken', stop - start);
        return true;
    } catch (e) {
        console.log('zeplo call failed', e.message);
        return false;
    }
}