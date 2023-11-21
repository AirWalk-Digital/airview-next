import React, { createContext, useState, useContext } from 'react';

// Create a context
const GitContext = createContext();

// Create a provider component
export const ContentWrapperContext = ({ children, defaultBranch }) => {
  const [currentBranch, setCurrentBranch] = useState(defaultBranch);

  return (
    <GitContext.Provider value={{ currentBranch, setCurrentBranch }}>
      {children}
    </GitContext.Provider>
  );
};

export function useBranch() {
    const context = useContext(GitContext);
  
    if (!context) {
      throw new Error('useBranch must be used within a ContentWrapperContext');
    }
  
    return context;
  }