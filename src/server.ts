import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { booksRoutes } from "./routes/books";
import { authRoutes } from "./routes/auth";
import { registerRoutes } from "./routes/register";

const app = fastify();

app.register(authRoutes)
app.register(booksRoutes)
app.register(registerRoutes)

app.register(fastifyCors, {
  origin: true
})

app.register(fastifyJwt, {
  secret:'ansiudnaiuwndmspamwndsrnkgaww2'
})

app
  .listen({
    host: "0.0.0.0",
    // port: Number(process.env.PORT!),
    port: process.env.PORT ? Number(process.env.PORT!) : 3333,
  })
  .then(() => console.log("server running!"));
