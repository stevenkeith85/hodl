import Pusher from "pusher";

export const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    useTLS: true,
    encryptionMasterKeyBase64: process.env.PUSHER_ENCRYPTION_KEY,
  });