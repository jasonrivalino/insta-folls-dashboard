import { rgbToHex, randomInt } from '../src/utils/rgbcolorseed'
import prisma from '../src/lib/prisma-mysql'
import { faker } from '@faker-js/faker'

async function main() {
  // Create 100 fake users
  const users = Array.from({ length: 100 }).map(() => ({
    pk_def_insta: BigInt(faker.number.int({ min: 1000000000, max: 9999999999 })),
    username: faker.internet.username(),
    fullname: faker.person.fullName(),
    profile_picture: faker.image.avatar(),
    is_private: faker.datatype.boolean(),
    media_post_total: faker.number.int({ min: 0, max: 100 }),
    followers: faker.number.int({ min: 100, max: 5000 }),
    following: faker.number.int({ min: 100, max: 5000 }),
    biography: faker.lorem.sentence(),
    is_mutual: true,
    last_update: new Date(Date.now()),
  }))

  await prisma.main_Instagram_Data.createMany({
    data: users,
  })

  console.log('Seeded 100 fake users')

  // Create 5 fake categories
  const categories = ['Main Acc', 'Family', 'School', 'College', 'Work'].map((relational) => ({
    relational,
    text_color: rgbToHex(randomInt(200, 255), randomInt(200, 255), randomInt(200, 255)),
    bg_color: rgbToHex(randomInt(0, 128), randomInt(0, 128), randomInt(0, 128)),
  }))
  
  await prisma.relation_Status.createMany({
    data: categories,
  })

  console.log('Seeded 5 fake categories')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })