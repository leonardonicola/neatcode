import z from "zod";

export interface AppConfig {
  secret: string;
  port: number;
  database: {
    url: string;
    poolSize: number;
  };
  logger: {
    level: "info" | "debug" | "error" | "warn";
  };
  isDev: boolean;
}

export type DatabaseConfig = AppConfig["database"];

export type LoggerConfig = AppConfig["logger"];

export default async (): Promise<AppConfig> => {
  const { data, error } = await z.safeParseAsync(
    z.object({
      SECRET: z.string(),
      PORT: z.coerce.number().min(1024).max(65535).default(3000),
      DATABASE_URL: z.url(),
      POOL_SIZE: z.number().default(15),
      LOGGER_LEVEL: z.enum(["info", "debug", "error", "warn"]).default("info"),
    }),
    process.env,
  );

  if (!!error) {
    throw new Error(error.message);
  }

  return {
    port: data.PORT,
    secret: data.SECRET,
    database: {
      url: data.DATABASE_URL,
      poolSize: data.POOL_SIZE,
    },
    logger: {
      level: data.LOGGER_LEVEL,
    },
    isDev: process.env.NODE_ENV !== "production",
  };
};
