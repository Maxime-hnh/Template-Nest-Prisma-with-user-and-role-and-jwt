import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Roles
  await prisma.role.createMany({
    data: [
      { name: RoleName.USER },
      { name: RoleName.ADMIN },
      { name: RoleName.SUPERADMIN }
    ],
    skipDuplicates: true
  });


  // super admin 
  const superAdminRole = await prisma.role.findFirst({
    where: { name: RoleName.SUPERADMIN }
  });
  if (!superAdminRole) throw new Error('Le rôle super admin est introuvable.')
  const hashedPassword = await bcrypt.hash('Kodana123', 10)
  await prisma.user.create({
    data: {
      firstName: "Kodana",
      lastName: "SuperAdmin",
      email: "kodana.developpement@gmail.com",
      password: hashedPassword,
      roleId: superAdminRole.id
    }
  })
}

main()
  .then(() => {
    console.log('🌱 Seed terminé');
    return prisma.$disconnect();
  })
  .catch(e => {
    console.error(e);
    return prisma.$disconnect();
  });


//npx prisma db seed
