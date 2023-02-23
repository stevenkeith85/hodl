import { NextRequest, NextResponse } from 'next/server';

import { getAsString } from "../../../lib/getAsString";
import { zRank } from '../../../lib/database/rest/zRank';
import { zRange } from '../../../lib/database/rest/zRange';


// prefix is the substring to look for. i.e. "ste" for "steven" or "steve"
// count is the number of suggestions we'd like to offer
export const getSuggestions = async (prefix: string, count: number = 4) => {

  const results = [];

  if (!prefix) {
    return results;
  }

  let start = await zRank('nicknames', prefix);
  if (!start) {
    return results;
  }

  const rangelen = 100;

  while (results.length !== count) {
    const range = await zRange('nicknames', start, start + rangelen -1, {});    
    start += rangelen;

    // if there's no suggestions in this range, we are done
    if (!range || !range.length) {
      break;
    }

    for (let entry of range) {
      let minLength = Math.min(entry.length, prefix.length);

      if (entry.slice(0, minLength) !== prefix.slice(0, minLength)) {
        // if we no longer have a prefix match, we are done
        count = results.length; // to break the outer loop
        break;
      }

      if (entry.endsWith('*') && results.length !== count) {
        // full words end with a '*', and we want a maximum of count suggestions
        results.push(entry.slice(0, -1)); 
      }
    };
  }

  return results;
}


export default async function route(req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response(null, { status: 405 });
  }

  const { searchParams } = new URL(req.url);

  const prefix = getAsString(searchParams.get('prefix'));

  if (!prefix) {
    return new Response(null, { status: 400 });
  }

  const suggestions = await getSuggestions(prefix);

  return NextResponse.json({ suggestions });
};

export const config = {
  runtime: 'experimental-edge',
}
