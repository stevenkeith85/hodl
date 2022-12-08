import { NextRequest, NextResponse } from 'next/server';

import { UserViewModel } from "../../../models/User";

import { getAsString } from "../../../lib/getAsString";
import { getUser } from '../../../lib/database/rest/getUser';
import { get } from '../../../lib/database/rest/get';


export const getUserUsingHandle = async (handle: string, viewerAddress: string): Promise<UserViewModel | null> => {
  
  if (!handle) {
    return null;
  }

  let address = handle;

  if (!/^0x[0-9A-F]{40}$/i.test(address)) {// An ethereum/polygon address is a 42 character hexadecimal address
    address = await get(`nickname:${handle}`);
  }

  if (!address) {
    return null;
  }

  // const start = Date.now();
  const user = await getUser(address, viewerAddress);
  // const stop = Date.now()
  // console.log('time taken', stop - start);
  return user;
}


export default async function route(req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response(null, { status: 405 });
  }

  const { searchParams } = new URL(req.url);

  const handle = getAsString(searchParams.get('handle'));
  const viewer = getAsString(searchParams.get('viewer'));

  if (!handle) {
    return new Response(null, { status: 400 });
  }

  const user = await getUserUsingHandle(handle, viewer);

  return NextResponse.json({user});
};

export const config = {
  runtime: 'experimental-edge',
}
