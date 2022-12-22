import formatISO from 'date-fns/formatISO';
import fromUnixTime from 'date-fns/fromUnixTime';
import { NextRequest } from 'next/server';
import { zRange } from "../../lib/database/rest/zRange";
import { chunk } from '../../lib/lodash';

export default async function route(req: NextRequest) {
    const domain = `https://www.hodlmymoon.com`;

    // get the content
    const pages = [
        {
            loc: '/',
            lastmod: formatISO(new Date()),
            changefreq: 'daily',
            priority: 1
        },
        {
            loc: '/learn',
            lastmod: formatISO(new Date()),
            changefreq: 'daily',
            priority: 1
        },
        {
            loc: '/explore?page=1',
            lastmod: formatISO(new Date()),
            changefreq: 'daily',
            priority: 1
        },
        {
            loc: '/about',
            lastmod: formatISO(new Date('2022-12-22')),
            changefreq: 'weekly',
            priority: 0.5
        },
        {
            loc: '/contact',
            lastmod: formatISO(new Date('2022-12-22')),
            changefreq: 'weekly',
            priority: 0.5
        },
        {
            loc: '/asset-license',
            lastmod: formatISO(new Date('2022-12-22')),
            changefreq: 'monthly',
            priority: 0.25
        },
    ];

    const tokenIdsWithScores = await zRange("tokens", 0, -1, { rev: true, withScores: true });

    const tokenAndCreationTime = chunk(tokenIdsWithScores, 2);
    const userAddresses = await zRange("users", 0, -1, { rev: true });


    // format it
    const pagesInSiteMap = pages.map(({ loc, lastmod, changefreq, priority }) => `<url>
        <loc>${domain}${loc}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
        </url>
    `).join('\n');

    const tokensInSiteMap = tokenAndCreationTime.map(([id, timestamp]) => `<url>
        <loc>${domain}/nft/${id}</loc>
        <lastmod>${formatISO(fromUnixTime(timestamp))}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>`
    ).join('\n');

    // TODO: If we record when the user lasts logs in, then we can probably give a hint for lastmod
    const usersInSiteMap = userAddresses.map(address =>
        `<url>
        <loc>${domain}/profile/${address}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
        </url>`
    ).join('\n');

    // generate sitemap here
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
      ${pagesInSiteMap}
      ${usersInSiteMap}
      ${tokensInSiteMap}
      </urlset>`

    return new Response(xml, { status: 200, headers: { 'Content-Type': 'text/xml' } })
}

export const config = {
    runtime: 'experimental-edge',
}
