import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { decodeJwt } from "jose";
import type { Session, SessionInfo } from "./SessionContext";
import { toast } from "sonner";

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

export async function LogOut() {
  try {
    await window.cookieStore.delete("session");
  } catch (error) {
    toast("failed to log out");
    console.log("failed to log out", error);
  }
}
