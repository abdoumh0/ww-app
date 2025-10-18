import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { decodeJwt } from "jose";
import type { Session, SessionInfo } from "./SessionContext";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getSession(): Promise<Session> {
  const session = (await window.cookieStore.get("session"))?.value;
  if (!session) return null;
  try {
    const claims = decodeJwt(session) as SessionInfo;
    return claims;
  } catch (error) {
    //TODO
    //try catch for implementing verification later
    return null;
  }
}

export function getOrCreateClientId(): string {
  const key = "client_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID(); // Or any unique ID generator
    sessionStorage.setItem(key, id);
  }
  return id;
}
