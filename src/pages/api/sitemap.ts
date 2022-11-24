import { NextRequest } from 'next/server';
import { zRange } from "../../lib/database/rest/zRange";


export default async function route (req: NextRequest) {
    const domain = process.env.VERCEL_URL || "https://www.hodlmymoon.com";

    const pages = ['/', '/explore', '/about', '/contact'];

    const tokenIds = await zRange("tokens", 0, -1, { rev: true });

    const pagesInSiteMap = pages.map(page => `<url><loc>${domain}${page}</loc></url>`).join('\n');
    const tokensInSiteMap = tokenIds.map(id => `<url><loc>${domain}/nft/${id}</loc></url>`).join('\n');

    // generate sitemap here
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
      ${pagesInSiteMap}
      ${tokensInSiteMap}
      </urlset>`

    return new Response(xml, {status: 200, headers: {'Content-Type': 'text/xml'}})
}

export const config = {
    runtime: 'experimental-edge',
}
