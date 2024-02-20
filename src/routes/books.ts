import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function booksRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify();
  })

  app.get("/books", async (request) => {
    const books = await prisma.book.findMany({
      where: {
        userId: request.user.sub
      },
      orderBy: {
        date: "desc",
      },
    });

    return { books };
  });

  app.get("/books/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const book = await prisma.book.findUniqueOrThrow({
      where: {
        id,
      },
    });

    // quando for por o app pra rodar como rede social tem q alterar isso
    if (book.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    return book;
  });

  app.post("/books", async (request, reply) => {
    const createBookSchema = z.object({
      name: z.string(),
      author: z.string(),
      review: z.string(),
      rating: z.string(),
    });

    const { name, author, review, rating } = createBookSchema.parse(
      request.body
    );

    await prisma.book.create({
      data: {
        name,
        userId: request.user.sub,
        author,
        review,
        rating: Number(rating),
      },
    });

    return reply.status(201).send();
  });

  app.put("/books/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const createBookSchema = z.object({
      name: z.string(),
      author: z.string(),
      review: z.string(),
      rating: z.string(),
    });

    const { name, author, review, rating } = createBookSchema.parse(
      request.body
    );

    let book = await prisma.book.findUniqueOrThrow({
      where: {
        id,
      }
    })

    if (book?.userId !== request.user.sub) {
      return reply.status(401).send()
    }

     book = await prisma.book.update({
      where: {
        id,
      },
      data: {
        name,
        author,
        review,
        rating: Number(rating),
      },
    });

    return book;
  });

  app.delete("/books/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const book = await prisma.book.findUniqueOrThrow({
      where: {
        id,
      }
    })

    if (book?.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    await prisma.book.delete({
      where: {
        id,
      },
    });

    return reply.status(204).send();
  });

  app.get('/getsusers', async () => {
    const users = await prisma.account.findMany()
    return { users }
  })
}