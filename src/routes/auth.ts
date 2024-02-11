import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function authRoutes(app: FastifyInstance) {
    app.post('/register', async (request) => {
        const userSchema = z.object({
            sub: z.string(),
            name: z.string(),
            picture: z.string().url(),
        })

        const userInfo = userSchema.parse(request.body)

        let user = await prisma.user.findUnique({
            where: {
                googleId: userInfo.sub,
            }
        })

        if(!user) {
            user = await prisma.user.create({
                data: {
                    googleId: userInfo.sub,
                    name: userInfo.name,
                    picture: userInfo.picture
                }
            })
        }

        const token = app.jwt.sign({
            name: user.name,
            picture: user.picture
        }, {
            sub: user.id,
            expiresIn: '30 days'
        })

        return {
            token,
        }
    })

    //criar rota get para retornar o user
}