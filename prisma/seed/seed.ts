//@ts-nocheck

/**
 * ! Executing this script will delete all data in your database and seed it with 10 user.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from "@snaplet/seed";
import { faker } from "@faker-js/faker"


const main = async () => {
  const seed = await createSeedClient();

  // Truncate all tables in the database
  await seed.$resetDatabase();

  // Seed the database with 10 user
  await seed.user((createMany)=> 
    createMany(5, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    image: faker.image.url(),
    }))
  );

  await seed.message((createMany) =>
    createMany(50, () => ({
      fromUser: Math.random() < 0.5,
      content: faker.lorem.sentences(),
      authorId: Math.floor(Math.random() * 5) + 1,
    }))
  );

  await seed
  // Type completion not working? You might want to reload your TypeScript Server to pick up the changes

  console.log("Database seeded successfully!");

  process.exit();
};

main();