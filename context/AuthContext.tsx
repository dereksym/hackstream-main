
import React, { createContext, useState, useContext, PropsWithChildren } from 'react';
import { User, UserRole } from '../types.ts';
import { USERS } from '../constants.ts';

interface AuthContextType {
  user: User;
  setUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// FIX: Changed component props to use PropsWithChildren for better type inference.
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User>(USERS.Visitor);

  const setUserRole = (role: UserRole) => {
    setUser(USERS[role]);
  };

  return (
    <AuthContext.Provider value={{ user, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};