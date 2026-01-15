import { z, ZodTypeAny } from "zod";

export const call = async <Response extends ZodTypeAny>(
  url: string,
  resultSchema: Response,
  options: RequestInit = { method: "GET" }
): Promise<z.infer<Response>> => {
  const response = await fetch(url, options);

  // TODO: Improve error handling
  if (response.status >= 400) throw await response.json();

  const raw = await response.json();

  return resultSchema.parse(raw);
};
