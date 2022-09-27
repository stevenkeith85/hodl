import { Queue } from "@serverlessq/nextjs";

// pages/api/queue

// export const createQueue = (name) => {
//     return Queue(
//         name,
//         "api/blockchain/transaction",
//         async (req, res) => {
//             res.send("finished");
//         },
//         {
//             retries: 1,
//             urlToOverrideWhenRunningLocalhost: `${process.env.NGROK_TUNNEL}/api/blockchain/transaction`,
//         }
//     );
// }