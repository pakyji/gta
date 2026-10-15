/**
 * Centralised API error handling for route handlers.
 * Throw `ApiError` anywhere inside a handler wrapped with `handleApi`
 * and the client receives a consistent `{ error, code }` JSON body.
 */
import { NextResponse } from "next/server";

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, message: string, code = "error") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const badRequest = (m: string) => new ApiError(400, m, "bad_request");
export const unauthorized = (m = "You need an active session. Please choose a platform and gamertag.") =>
  new ApiError(401, m, "unauthorized");
export const notFound = (m = "Not found.") => new ApiError(404, m, "not_found");
export const serviceUnavailable = (m: string) => new ApiError(503, m, "unavailable");

export function errorResponse(err: unknown): NextResponse {
  if (err instanceof ApiError) {
    return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
  }
  const message = err instanceof Error ? err.message : "Unexpected server error.";
  const isDb = /ECONNREFUSED|database|relation .* does not exist|connect/i.test(message);
  console.error("[api] unhandled error:", err);
  return NextResponse.json(
    {
      error: isDb ? "Database is unreachable. Check DATABASE_URL and that PostgreSQL is running." : "Unexpected server error.",
      code: isDb ? "database_error" : "internal",
    },
    { status: 500 },
  );
}

type Handler<Ctx> = (req: Request, ctx: Ctx) => Promise<Response>;

export function handleApi<Ctx = unknown>(fn: Handler<Ctx>): Handler<Ctx> {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (err) {
      return errorResponse(err);
    }
  };
}

export async function readJson<T = Record<string, unknown>>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw badRequest("Request body must be valid JSON.");
  }
}
