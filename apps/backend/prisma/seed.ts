import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt'

const prisma = new PrismaClient();

async function createUser(
  id: string,
  userData: {
    roleId: string;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    password: string;
  },
) {
  const { roleId, ...user } = userData;

  await prisma.user.upsert({
    where: { id },
    update: {},
    create: {
      id,
      roleId,
      ...user,
    },
  });
  console.log(`Upserted User ${user.username}`);

}

async function main() {

    const userRoleId = '780b4d11-748c-482b-abad-8dd42965c969';
    await prisma.role.upsert({
      where: { id: userRoleId },
      update: {},
      create: {
        id: userRoleId,
        name: 'User',
      },
    });
    console.log('Upserted Coordinator Role');


  const doctorRoleId = '3c7a2642-8a58-40bd-aac2-fa48321f5664';
  await prisma.role.upsert({
    where: { id: doctorRoleId },
    update: {},
    create: {
      id: doctorRoleId,
      name: 'Doctor',
    },
  });
  console.log('Upserted Doctor Role');

  const administratorRoleId = '33e85104-816c-4266-891b-6ef9b8ae7c15';
  await prisma.role.upsert({
    where: { id: administratorRoleId },
    update: {},
    create: {
      id: administratorRoleId,
      name: 'Administrator',
    },
  });
  console.log('Upserted Administrator Role');

//   const superSecretPasswordHash =
//     '$2b$10$e51llQJGBinJKWbO73UHn.Kis90tMGa1TW1Hw7AKDqODmvDBdrYRC';
const superSecretPasswordHash = await bcrypt.hash('pass1234', 10);

  await createUser('58544ec4-d693-4d0c-9a66-95b74e879059', {
    roleId: userRoleId,
    username: 'carol',
    email: 'carol@example.com',
    firstname: 'Carol',
    lastname: 'White',
    password: superSecretPasswordHash,
  });

  await createUser('83e54d70-51db-4392-8f6f-65f70ff30880', {
    roleId: doctorRoleId,
    username: 'abagail',
    email: 'abagail@example.com',
    firstname: 'Abagail',
    lastname: 'Advocate',
    password: superSecretPasswordHash,
  });


  await createUser('fa13e723-d887-4381-b25c-5a2ade423bcc', {
    roleId: administratorRoleId,
    username: 'andy',
    email: 'andy@example.com',
    firstname: 'Andy',
    lastname: 'Administrator',
    password: superSecretPasswordHash,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
