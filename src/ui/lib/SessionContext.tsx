import { createContext, useContext, useEffect, useState } from "react";
import type { AccountInfo } from "../../../types";
import { getSession } from "./utils";
import type { JWTPayload } from "jose";

export interface SessionInfo extends JWTPayload {
  user: AccountInfo;
}
export type Session = SessionInfo | null;

type SessionContextType = {
  session: Session;
  setSession: (session: Session) => void;
  refreshSession: () => Promise<void>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session>(null);

  const refreshSession = async () => {
    const sessionData = await getSession();
    setSession(sessionData);
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession, refreshSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context)
    throw new Error("useSession must be used within a SessionProvider");
  return context;
};
