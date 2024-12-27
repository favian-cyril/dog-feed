import { UserData } from "@/types/User";
import { createContext, Dispatch, SetStateAction, useContext } from "react";


export interface UserContextType {
  userData: UserData | null;
  id: string | null;
  isLoading: boolean;
  setSelectedBreeds: Dispatch<SetStateAction<string[]>>;
  selectedBreeds: string[];
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};