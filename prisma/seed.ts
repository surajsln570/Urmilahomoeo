import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Converted from database/seeders/RoleSeeder.php + DatabaseSeeder.php
async function main() {
  const roleNames = ["Super Admin", "Admin", "Doctor", "Patient"];

  for (const name of roleNames) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { name: "Super Admin" } });

  const password = await bcrypt.hash("password", 10);
  await prisma.user.upsert({
    where: { email: "admin@urmilaclinic.test" },
    update: {},
    create: {
      name: "Clinic Admin",
      mobile: "9999999999",
      email: "admin@urmilaclinic.test",
      password,
      roleId: superAdminRole.id,
    },
  });

  console.log("Seed complete. Login with admin@urmilaclinic.test / password");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
