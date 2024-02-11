import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { booksRoutes } from "./routes/books";
import { authRoutes } from "./routes/auth";

const app = fastify();

app.register(booksRoutes)
app.register(authRoutes)

app.register(fastifyCors, {
  origin: true
})

app.register(fastifyJwt, {
  secret:'ansiudnaiuwndmspamwndsrnkgaww2'
})

app
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.port) : 3333,
  })
  .then(() => console.log("server running!"));
