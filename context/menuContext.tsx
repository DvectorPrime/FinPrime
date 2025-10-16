"use client";

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface MenuContextType {
  menuShowing: boolean;
  setMenuShowing: Dispatch<SetStateAction<boolean>>;
  toggleMenu: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuShowing, setMenuShowing] = useState<boolean>(false);

  const toggleMenu = () => {
    setMenuShowing(prev => !prev);
  };

  return (
    <MenuContext.Provider value={{ menuShowing, setMenuShowing, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};