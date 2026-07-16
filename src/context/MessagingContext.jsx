import React, { createContext, useContext, useState } from 'react';

const MessagingContext = createContext();

export function useMessaging() {
  return useContext(MessagingContext);
}

export function MessagingProvider({ children }) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);

  const openChat = (chatId) => {
    setActiveChatId(chatId);
    setIsOverlayOpen(true);
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
    setActiveChatId(null);
  };

  const value = {
    isOverlayOpen,
    setIsOverlayOpen,
    activeChatId,
    setActiveChatId,
    openChat,
    closeOverlay
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
}
