import { UserContext, UserContextType } from "./UserContext";

export const UserProvider: React.FC<{
  children: React.ReactNode;
  value: UserContextType;
}> = ({ children, value }) => {
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};