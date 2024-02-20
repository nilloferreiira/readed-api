import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function signUp(app: FastifyInstance) {
    app.post('/sign', async (request, reply) => {
        const signSchema = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string()
        })

        const {name , email, password} = signSchema.parse(request.body)

        let user = await prisma.account.findUnique({
            where: {
                email,
            }
        })        

        if(!user) {
            user = await prisma.account.create({
                data: {
                    name,
                    email,
                    password
                }
            })
        }

        return { user }
    })

    app.get('/sign', async () => {
        const users = await prisma.account.findMany()

        return { users }
    })
}