import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { data } from "./data";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("racheliscool", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  await prisma.note.create({
    data: {
      title: "My second note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  for (const board of data.boards) {
    const columns = board.columns.map((column) => column.name);
    await prisma.board.create({
      data: {
        name: board.name,
        columns,
        tasks: {
          create: board.columns.flatMap((column) =>
            column.tasks.map((task) => ({
              title: task.title,
              description: task.description,
              column: task.status,
              subtasks: {
                create: task.subtasks.map((subtask) => ({
                  title: subtask.title,
                  completed: subtask.isCompleted,
                })),
              },
            }))
          ),
        },
      },
    });
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
