import z from "zod";

export interface AppConfig {
  secret: string;
  port: number;
  logger: {
    level: "info" | "debug" | "error" | "warn";
  };
  isDev: boolean;
}

export type LoggerConfig = AppConfig["logger"];

export const rootConfig = async (): Promise<AppConfig> => {
  const { data, error } = await z.safeParseAsync(
    z.object({
      SECRET: z.string(),
      PORT: z.coerce.number().min(1024).max(65535).default(3000),
      LOGGER_LEVEL: z.enum(["info", "debug", "error", "warn"]).default("info"),
    }),
    process.env,
  );

  if (error) {
    throw new Error(error.message);
  }

  return {
    port: data.PORT,
    secret: data.SECRET,
    logger: {
      level: data.LOGGER_LEVEL,
    },
    isDev: process.env.NODE_ENV !== "production",
  };
};
