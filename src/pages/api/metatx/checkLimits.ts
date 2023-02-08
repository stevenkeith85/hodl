import { NextRequest, NextResponse } from 'next/server';
import { getAsString } from '../../../lib/getAsString';


export default async function route (req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response(null, { status: 405 });
  }

  const { searchParams } = new URL(req.url);
  const address = getAsString(searchParams.get('address'));
  
  const url = new URL("https://api.biconomy.io/api/v1/dapp/checkLimits");
  const params = {
    apiId: process.env.BICONOMY_API_CREATE_TOKEN_ID,
    userAddress: address
  }

  url.search = new URLSearchParams(params).toString();

  const requestOptions = {
    method: 'GET',
    headers: { 
      "Content-Type": "application/x-www-form-urlencoded", 
      "x-api-key": process.env.NEXT_PUBLIC_BICONOMY_API_KEY
    }
  };

  const data = await fetch(url, requestOptions).then(data => data.json());  
  return NextResponse.json(data);
};


export const config = {
  runtime: 'experimental-edge',
}
