import axios from 'axios';


export const addToZeplo = async (
    endpoint,
    postData,
    trace = '') => {
    try {
        const serverlessFunctionUrl = `https://${process.env.VERCEL_URL || process.env.MESSAGE_HANDLER_HOST}/${endpoint}`;
        const zeploUrl = `https://zeplo.to/${serverlessFunctionUrl}?secret=${process.env.ZEPLO_SECRET}&_token=${process.env.ZEPLO_TOKEN}&_trace=${trace}&_retry=1|exponential|2`;

        const { data } = await axios.post(
            zeploUrl,
            postData
        );

        return true;
    } catch (e) {
        console.log('zeplo call failed', e.message);
        return false;
    }
}


export const queueTxAndAction = async (
    hash,
    address) => {
    try {
        const start = Date.now();

        const { data } = await axios.post(
            `https://zeplo.to/step?_token=${process.env.ZEPLO_TOKEN}`, [
            {
                url: `https://${process.env.VERCEL_URL || process.env.MESSAGE_HANDLER_HOST}/api/blockchain/transaction?secret=${process.env.ZEPLO_SECRET}&_step=A&_retry=4|exponential|2`,
                body: {
                    hash,
                    address
                }
            },
            {
                url: `https://${process.env.VERCEL_URL || process.env.MESSAGE_HANDLER_HOST}/api/actions/add?secret=${process.env.ZEPLO_SECRET}&_step=B&_requires=A&_retry=4|exponential|2`,
            },
        ]);

        const stop = Date.now()
        console.log('addingStepsToZeplo time taken', stop - start);
        return true;
    } catch (e) {
        console.log('zeplo call failed', e.message);
        return false;
    }
}
