// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from 'next-connect'
import * as Redis from 'ioredis';
import dotenv from 'dotenv'

dotenv.config({ path: '../.env' })

const apiRoute = nextConnect({
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

let redis = new Redis(process.env.REDIS_CONNECTION_STRING);


apiRoute.get(async (req: NextApiRequest, res: NextApiResponse) => {  
    const tokens = [{"tokenId":2,"name":"Dug 2","description":"I like my bandana","image":"ipfs://bafkreicb3gm2lu6b5fy64lzmalaqao4dcs7aa3eitpledknvjum5uzay6u","phash":"853763601edd684f"},{"tokenId":4,"name":"Dug 4","description":"I like my bandana","image":"ipfs://bafkreicb3gm2lu6b5fy64lzmalaqao4dcs7aa3eitpledknvjum5uzay6u","phash":"853763601edd684f"},{"tokenId":6,"name":"Dug 6","description":"I like my bandana","image":"ipfs://bafkreicb3gm2lu6b5fy64lzmalaqao4dcs7aa3eitpledknvjum5uzay6u","phash":"853763601edd684f"},{"tokenId":8,"name":"Dug 8","description":"I like my bandana","image":"ipfs://bafkreicb3gm2lu6b5fy64lzmalaqao4dcs7aa3eitpledknvjum5uzay6u","phash":"853763601edd684f"},{"tokenId":10,"name":"Scottish Open","description":"Silver medal on the podium","image":"ipfs://bafkreiedjgeayh5h7nt3acv6btdjzngphefjlyl7lqfzosejf5kigr6cpe","phash":"ac2db6a47b44ac3a"},{"tokenId":11,"name":"London 1","description":"Cathedral","image":"ipfs://bafybeicxcx3lprvyraoha2r3mdmsxtnfhu37llswwvqi32nypqqxn3piey","phash":"cd5c70aa2ade9455"},{"tokenId":12,"name":"London 2","description":"Shard","image":"ipfs://bafybeiaxavkhd5xhalyfrj3w2rllmbrervy7yg7ooruqbt2d3xg752c36m","phash":"245eaf70154eb9b1"},{"tokenId":13,"name":"London 3","description":"Thames","image":"ipfs://bafybeieolfdeumhuy2vetf464dpaqiu6iuqum5ml2ohpbws6b7ynd6bm7u","phash":"560ba553aa41b7ab"},{"tokenId":15,"name":"Dug 2","description":"I like my bandana","image":"ipfs://bafkreicb3gm2lu6b5fy64lzmalaqao4dcs7aa3eitpledknvjum5uzay6u","phash":"853763601edd684f"},{"tokenId":17,"name":"Dug 4","description":"Hi There!","image":"ipfs://bafkreigmzewlel4a4e2gpvwkohhtt2n5yyeydbi3jxxptoznfefomgu7f4","phash":"e08d9e1d3af0914f"},{"tokenId":16,"name":"Dug 3","description":"Waiting on mum.","image":"ipfs://bafkreifkaykoquk4tab2oupg4rus5fwzhf5idmyjptremrdvgoiglkjcmy","phash":"f3891c6766989956"},{"tokenId":19,"name":"Dug 2","description":"I like my bandana","image":"ipfs://bafkreicb3gm2lu6b5fy64lzmalaqao4dcs7aa3eitpledknvjum5uzay6u","phash":"853763601edd684f"},{"tokenId":21,"name":"Dug 4","description":"Hi There!","image":"ipfs://bafkreigmzewlel4a4e2gpvwkohhtt2n5yyeydbi3jxxptoznfefomgu7f4","phash":"e08d9e1d3af0914f"},{"tokenId":23,"name":"Dug 6","description":"Hi There Again!","image":"ipfs://bafybeigxlmhhnyjiy2jf3xnloujydwbztkzidtptbr2d2cmxxfxcytkpea","phash":"853763601edd6a0f"},{"tokenId":25,"name":"Dug 8","description":"I like this sofa","image":"ipfs://bafybeicphr6h6w6pb63acy5n6aqwuufmc64iwq6yev6hgnqbqkgvbxla2i","phash":"e48d8e656af0914f"},{"tokenId":26,"name":"London 1","description":"Cathedral","image":"ipfs://bafybeicxcx3lprvyraoha2r3mdmsxtnfhu37llswwvqi32nypqqxn3piey","phash":"cd5c70aa2ade9455"},{"tokenId":27,"name":"London 2","description":"Shard","image":"ipfs://bafybeiaxavkhd5xhalyfrj3w2rllmbrervy7yg7ooruqbt2d3xg752c36m","phash":"245eaf70154eb9b1"},{"tokenId":28,"name":"London 3","description":"Thames","image":"ipfs://bafybeieolfdeumhuy2vetf464dpaqiu6iuqum5ml2ohpbws6b7ynd6bm7u","phash":"560ba553aa41b7ab"}];
    // const { tokenId } = req.query;
    // console.log('CALLING REDIS');

    // const pipeline = redis.pipeline();
    // for (const token of tokenId) {
    //     pipeline.get('token:' + token);
    // }

    // const promise = await pipeline.exec()
    // const tokens = promise.map(result => JSON.parse(result[1]))
    res.status(200).json({tokens})
});


export default apiRoute;
