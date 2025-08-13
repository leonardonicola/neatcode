import z from "zod";

export interface DatabaseConfig {
  database: {
    url: string;
    poolSize: number;
  };
}

export type DatabaseEnv = DatabaseConfig["database"];

export const dbConfig = async () => {
  const { data, error } = await z.safeParseAsync(
    z.object({
      DATABASE_URL: z.url(),
      POOL_SIZE: z.number().default(15),
    }),
    process.env,
  );

  if (error) {
    throw new Error(error.message);
  }

  return {
    database: {
      url: data.DATABASE_URL,
      poolSize: data.POOL_SIZE,
    },
  };
};
