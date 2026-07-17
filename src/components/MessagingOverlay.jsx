import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, doc, query, where, onSnapshot, setDoc, addDoc, serverTimestamp, getDoc, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useMessaging } from '../context/MessagingContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function MessagingOverlay() {
  const { currentUser } = useAuth();
  const { isOverlayOpen, setIsOverlayOpen, activeChatId, setActiveChatId } = useMessaging();
  
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatUser, setChatUser] = useState(null);
  const [loadingChats, setLoadingChats] = useState(true);
  
  const messagesEndRef = useRef(null);

  // Fetch list of conversations
  useEffect(() => {
    if (!currentUser) return;
    
    // NOTE: We DO NOT use orderBy('updatedAt', 'desc') here in the query!
    // Firebase requires a composite index for where() + orderBy() on different fields.
    // If that index doesn't exist, the query silently fails and loading never finishes.
    // Instead, we fetch them and sort them client-side.
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatsData = [];
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const otherUserId = data.participants?.find(id => id !== currentUser.uid);
        
        if (otherUserId) {
          const userSnap = await getDoc(doc(db, 'users', otherUserId));
          if (userSnap.exists()) {
            chatsData.push({
              id: docSnap.id,
              ...data,
              otherUser: userSnap.data(),
              otherUserId
            });
          }
        }
      }
      
      // Sort client-side by updatedAt descending
      chatsData.sort((a, b) => {
        const timeA = a.updatedAt?.toMillis() || 0;
        const timeB = b.updatedAt?.toMillis() || 0;
        return timeB - timeA;
      });

      setChats(chatsData);
      setLoadingChats(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Fetch current chat details and messages
  useEffect(() => {
    if (!activeChatId || !currentUser) {
      setMessages([]);
      setChatUser(null);
      return;
    }

    const otherUserId = activeChatId.split('_').find(id => id !== currentUser.uid);
    if (otherUserId) {
      getDoc(doc(db, 'users', otherUserId)).then(snap => {
        if (snap.exists()) setChatUser(snap.data());
      });
    }

    const messagesRef = collection(db, 'chats', activeChatId, 'messages');
    // Here we can use orderBy because there is no where() clause causing an index conflict.
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsubscribe();
  }, [activeChatId, currentUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !activeChatId) return;

    const text = newMessage;
    setNewMessage('');

    try {
      const chatRef = doc(db, 'chats', activeChatId);
      await setDoc(chatRef, {
        participants: activeChatId.split('_'),
        lastMessage: text,
        updatedAt: serverTimestamp()
      }, { merge: true });

      await addDoc(collection(chatRef, 'messages'), {
        text,
        senderId: currentUser.uid,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="fixed bottom-[85px] right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end">
      
      {/* Overlay Window */}
      <AnimatePresence>
        {isOverlayOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant w-[350px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[60vh] flex flex-col overflow-hidden"
          >
            {!activeChatId ? (
              // Chat List View
              <>
                <div className="bg-primary text-white p-3 flex justify-between items-center shadow-sm z-10">
                  <h3 className="font-title-md font-bold">Messages</h3>
                  <button onClick={() => setIsOverlayOpen(false)} className="p-1 rounded-full hover:bg-white/20 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto bg-surface">
                  {loadingChats ? (
                    <div className="p-4 flex justify-center"><span className="material-symbols-outlined animate-spin text-primary">refresh</span></div>
                  ) : chats.length === 0 ? (
                    <div className="p-6 text-center text-on-surface-variant text-body-md">
                      No conversations yet. Connect with someone to start chatting!
                    </div>
                  ) : (
                    chats.map(chat => (
                      <div 
                        key={chat.id}
                        onClick={() => setActiveChatId(chat.id)}
                        className="p-3 border-b border-outline-variant/50 cursor-pointer flex gap-3 hover:bg-surface-container-low transition-colors"
                      >
                        <img src={chat.otherUser?.photoURL || "https://ui-avatars.com/api/?name=User"} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
                        <div className="overflow-hidden flex-1 flex flex-col justify-center">
                          <h4 className="font-label-md font-bold text-on-surface truncate">{chat.otherUser?.displayName || chat.otherUser?.name || 'User'}</h4>
                          <p className="text-body-sm text-on-surface-variant truncate mt-0.5">{chat.lastMessage}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              // Active Chat View
              <>
                <div className="bg-primary text-white p-2 flex justify-between items-center shadow-sm z-10">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setActiveChatId(null)} className="p-1.5 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </button>
                    {chatUser && (
                      <div className="flex items-center gap-2">
                        <img src={chatUser.photoURL || "https://ui-avatars.com/api/?name=User"} className="w-8 h-8 rounded-full object-cover" alt="" />
                        <span className="font-label-md font-bold truncate max-w-[150px]">{chatUser.displayName || chatUser.name}</span>
                      </div>
                    )}
                  </div>
                  <button onClick={() => setIsOverlayOpen(false)} className="p-1.5 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-surface-container-lowest">
                  {messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.uid;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-3 py-1.5 ${
                          isMe 
                            ? 'bg-primary text-white rounded-br-sm' 
                            : 'bg-surface-container text-on-surface rounded-bl-sm border border-outline-variant'
                        }`}>
                          <p className="text-body-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-2 bg-surface border-t border-outline-variant">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input 
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Write a message..."
                      className="flex-1 bg-surface-container-lowest border border-outline rounded-full px-3 py-1.5 text-body-sm focus:border-primary focus:outline-none transition-colors"
                    />
                    <button 
                      type="submit" 
                      disabled={!newMessage.trim()}
                      className="p-1.5 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center shrink-0"
                    >
                      <span className="material-symbols-outlined text-[18px]">send</span>
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <div className="fixed bottom-[85px] right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end">
        <button 
          onClick={() => setIsOverlayOpen(!isOverlayOpen)}
          className="relative w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center focus:outline-none"
        >
          <span className="material-symbols-outlined text-3xl">
            {isOverlayOpen ? 'close' : 'chat'}
          </span>
          
          {/* Badge */}
          {!isOverlayOpen && chats.length > 0 && (
            <div className="absolute -top-1 -right-1 bg-error text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-surface">
              {chats.length > 9 ? '9+' : chats.length}
            </div>
          )}
        </button>
      </div>

    </div>
  );
}
