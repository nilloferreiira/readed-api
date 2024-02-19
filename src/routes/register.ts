import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function registerRoutes(app: FastifyInstance) {
  app.post("/signup", async (request) => {
    const userSchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    });
    
    const userInfo = userSchema.parse(request.body);

    //comentar linha de cima e usar userInfo = request.body

    if (!prisma || !prisma.account) {
      console.error("Objeto 'prisma' ou 'prisma.account' não está definido.");
      return;
    }

    let user = await prisma.account.findUnique({
      where: {
        email: userInfo.email,
      },
    });

    if (!user) {
      user = await prisma.account.create({
        data: {
          name: userInfo.name,
          email: userInfo.email,
          password: userInfo.password,
        },
      });
    }

    const token = app.jwt.sign(
      {
        name: user.name,
      },
      {
        sub: user.id,
        expiresIn: "30 days",
      }
    );

    return {
      token,
    };
  });
}
