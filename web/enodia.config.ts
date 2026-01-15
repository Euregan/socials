export default {
  schema: "../schema.graphql",
  client: {
    path: "./src/api.ts",
    react: {
      // @ts-expect-error TS doesn't know this file runs on node
      url: `${process.env.VITE_API_URL}/graphql`,
    },
  },
  scalars: {
    Date: { name: "Date" },
  },
};
