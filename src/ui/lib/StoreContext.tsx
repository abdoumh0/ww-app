import React, { createContext, useContext, useState } from "react";

type Props = {
  children?: React.ReactNode;
};

type StoreContextType = {
  total: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export default function StoreProvider({ children }: Props) {
  const [total, setTotal] = useState(0);

  return (
    <StoreContext.Provider value={{ total, setTotal }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
