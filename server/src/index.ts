import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server";
import { schema } from "./schema";

const prisma = new PrismaClient();

const server = new ApolloServer({
  schema,
  context: {
    prisma,
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready att ${url}`);
});
