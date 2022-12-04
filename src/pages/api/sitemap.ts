import { NextRequest } from 'next/server';
import { zRange } from "../../lib/database/rest/zRange";


export default async function route (req: NextRequest) {
    const domain = `https://www.hodlmymoon.com`;

    // get the content
    const pages = [
        '/',
        '/about', 
        '/asset-license',
        '/contact',
        '/explore', 
        '/learn',
        '/learn/connecting-a-wallet',
        '/learn/sign-up-with-coinbase-mobile'
    ];

    const tokenIds = await zRange("tokens", 0, -1, { rev: true });
    const userAddresses = await zRange("users", 0, -1, { rev: true });


    // format it
    const pagesInSiteMap = pages.map(page => `<url><loc>${domain}${page}</loc></url>`).join('\n');
    const tokensInSiteMap = tokenIds.map(id => `<url><loc>${domain}/nft/${id}</loc></url>`).join('\n');
    const usersInSiteMap = userAddresses.map(address => `<url><loc>${domain}/profile/${address}</loc></url>`).join('\n');


    // generate sitemap here
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
      ${pagesInSiteMap}
      ${usersInSiteMap}
      ${tokensInSiteMap}
      </urlset>`

    return new Response(xml, {status: 200, headers: {'Content-Type': 'text/xml'}})
}

export const config = {
    runtime: 'experimental-edge',
}
