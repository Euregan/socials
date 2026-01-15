export default {
  schema: "../schema.graphql",
  server: {
    path: "./src/graphql.ts",
  },
  scalars: {
    Date: { name: "Date" },
  },
};
