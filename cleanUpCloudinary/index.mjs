import { Redis } from "@upstash/redis/with-fetch";
import dotenv from 'dotenv'
import readline from "readline-sync";

dotenv.config({ path: '.env.development.local' })

const client = Redis.fromEnv();
import cloudinary from 'cloudinary'

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const getRedisCids = async () => {
  const ids = await client.zrange('tokens', 0, -1);

  const tokenIds = ids.map(id => `token:${id}`)

  const tokens = await client.mget(...tokenIds);
  return new Set(tokens.flatMap(token => [token.image, token.properties.asset.uri]));
}

// This goes through our tokens collection, and uses it to look up all the valid cids
const main = async () => {

  const prefix = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER;

  let resources = [];
  let next_cursor = "";

  do {
    const result = await cloudinary.v2.api.resources({
      type: 'upload',
      prefix,
      max_results: 500,
      next_cursor
    });

    resources = resources.concat(result.resources);

    next_cursor = result.next_cursor;

  } while (next_cursor)

  console.log("Number of assets on cloudinary", resources.length);

  const redisCids = await getRedisCids();

  const orphanedResources = resources.filter(resource => {
    const cid = resource.public_id.split('/')[2];
    return !(redisCids.has(cid));
  })

  console.log("Number of orphaned resources", orphanedResources.length);

  const orphanedResourcesOlderThanAWeek = orphanedResources.filter(resource => {
    let d1 = new Date(resource.created_at);
    let d2 = Date.now()

    return +d2 > d1.setDate(d1.getDate());
  });
  console.log("Number of orphaned resources older than one week", orphanedResourcesOlderThanAWeek.length);
  console.log("orphanedResourcesOlderThanAWeek", orphanedResourcesOlderThanAWeek)

  const publicIdsToDelete = orphanedResourcesOlderThanAWeek.map(resource => resource.public_id)

  console.log("publicIdsToDelete", publicIdsToDelete);

  const answer = readline.question('Are you sure (y/n) ?')

  if (answer !== 'y') {
    console.log('aborting');
    process.exit(0)
  }
  // TODO: This needs to run in a loop; similar to the previous cloudinary request
  // delete 100 public_ids
  const result = await cloudinary.v2.api.delete_resources(publicIdsToDelete);
  console.log(result)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
