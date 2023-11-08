import { createClient } from "@libsql/client";
import invariant from "tiny-invariant";

/**
 * @description
 * Creates and returns the Turso Client used to query the DB
 * 
 * @returns 
 * the instantiated Turso Client
 * 
 * @throws TURSO_DB_URL
 * invariant throws if value is not in ENV
 * 
 * @throws TURSO_DB_AUTH_TOKEN
 * invariant throws if value is not in ENV
 */
export function createTursoClient()
{
    invariant(process.env.TURSO_DB_URL, "TURSO_DB_URL not set")
    invariant(process.env.TURSO_DB_AUTH_TOKEN, "TURSO_DB_AUTH_TOKEN not set")

    return createClient({
        url: process.env.TURSO_DB_URL,
        authToken: process.env.TURSO_DB_AUTH_TOKEN
    })
}