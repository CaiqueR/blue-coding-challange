import { makeSchema, objectType, queryType } from "nexus";

const History = objectType({
  name: "History",
  definition(t) {
    t.id("id");
    t.string("queryString");
    t.string("timestamp");
  },
});

const Query = queryType({
  definition(t) {
    t.list.field("histories", {
      type: "History",
      resolve: async (_parent, _args, ctx) => {
        return ctx.prisma.history.findMany();
      },
    });
  },
});

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field("createHistory", {
      type: "History",
      args: {
        queryString: "String",
      },
      resolve: async (_parent, args, ctx) => {
        if (!args.queryString) {
          return;
        }
        return ctx.prisma.history.create({
          data: {
            queryString: args.queryString,
            timestamp: new Date().toISOString(),
          },
        });
      },
    });
    t.field("clearHistories", {
      type: "Int",
      resolve: async (_parent, _args, ctx) => {
        return ctx.prisma.history.deleteMany();
      },
    });
  },
});

export const schema = makeSchema({
  types: [Query, Mutation, History],
  outputs: {
    schema: __dirname + "/schema.graphql",
    typegen: __dirname + "/generated/nexus.ts",
  },
});
