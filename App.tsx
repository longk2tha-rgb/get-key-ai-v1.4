import React, { useState, useCallback, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import { USERS } from './data/users';
import type { User } from './data/types';

const APP_USERS_STORAGE_KEY = 'getkeyai_users';

const parseDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('/').map(Number);
  // Month is 0-indexed in JavaScript Date
  return new Date(year, month - 1, day);
};

const isExpired = (expiryDateStr: string): boolean => {
  const expiryDate = parseDate(expiryDateStr);
  // Treat invalid dates as expired for security
  if (isNaN(expiryDate.getTime())) {
    return true;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return expiryDate < today;
};

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    // 1. Load users from storage or use defaults
    let loadedUsers: User[] = USERS;
    try {
      const savedUsersJson = localStorage.getItem(APP_USERS_STORAGE_KEY);
      if (savedUsersJson) {
        loadedUsers = JSON.parse(savedUsersJson);
      }
    } catch (error) {
      console.error("Failed to parse users from localStorage, using defaults.", error);
    }
    
    // 2. Filter out expired users
    const activeUsers = loadedUsers.filter(user => !isExpired(user.expiryDate));

    // 3. If cleanup occurred, update storage with the clean list
    if (activeUsers.length < loadedUsers.length) {
      try {
        localStorage.setItem(APP_USERS_STORAGE_KEY, JSON.stringify(activeUsers));
      } catch (error) {
        console.error("Failed to save cleaned user list to localStorage during init", error);
      }
    }
    
    // 4. Return the clean, active user list for the initial state
    return activeUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Effect to save users to localStorage whenever the users state changes
  useEffect(() => {
    try {
      localStorage.setItem(APP_USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Failed to save users to localStorage", error);
    }
  }, [users]);

  const handleLogin = useCallback((name: string, code: string): string | null => {
    const user = users.find(
      (u) => u.name.trim().toLowerCase() === name.trim().toLowerCase() && u.code.trim().toLowerCase() === code.trim().toLowerCase()
    );

    if (!user) {
      return 'Họ và tên hoặc Mã code không chính xác.';
    }

    if (isExpired(user.expiryDate)) {
      // This case should be rare now with automatic cleanup, but it's a good safeguard.
      return 'Mã code của bạn đã hết hạn.';
    }

    setCurrentUser(user);
    return null; // Success
  }, [users]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {currentUser ? (
        <MainPage user={currentUser} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;