import z from "zod";

export interface AppConfig {
  secret: string;
  port: number;
  logger: {
    level: "info" | "debug" | "error" | "warn";
  };
  isDev: boolean;
  oauth2: {
    authUrl: string;
    tokenUrl: string;
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
  };
}

export type OAuth2Config = AppConfig["oauth2"];

export type LoggerConfig = AppConfig["logger"];

export const rootConfig = async (): Promise<AppConfig> => {
  const { data, error } = await z.safeParseAsync(
    z.object({
      SECRET: z.string(),
      PORT: z.coerce.number().min(1024).max(65535).default(3000),
      LOGGER_LEVEL: z.enum(["info", "debug", "error", "warn"]).default("debug"),
      OAUTH2_AUTH_URL: z.url(),
      OAUTH2_TOKEN_URL: z.url(),
      OAUTH2_CLIENT_ID: z.string(),
      OAUTH2_CLIENT_SECRET: z.string(),
      OAUTH2_CALLBACK_URL: z.string(),
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
    oauth2: {
      authUrl: data.OAUTH2_AUTH_URL,
      callbackUrl: data.OAUTH2_CALLBACK_URL,
      clientId: data.OAUTH2_CLIENT_ID,
      clientSecret: data.OAUTH2_CLIENT_SECRET,
      tokenUrl: data.OAUTH2_TOKEN_URL,
    },
  };
};
