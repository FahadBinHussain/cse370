import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function promoteToAdmin(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    if (user.role === "admin") {
      console.log(`User ${email} is already an admin`);
      process.exit(0);
    }

    await prisma.user.update({
      where: { email },
      data: { role: "admin" },
    });

    console.log(`Successfully promoted ${email} to admin`);
  } catch (error) {
    console.error("Error promoting user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line argument or use default from env
const email = process.argv[2] || process.env.ADMIN_EMAIL || "admin@uddog.com";
promoteToAdmin(email);
