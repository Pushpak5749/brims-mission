import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, doc, query, where, orderBy, onSnapshot, setDoc, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Messages() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatUser, setChatUser] = useState(null);
  const [loadingChats, setLoadingChats] = useState(true);
  
  const messagesEndRef = useRef(null);

  // Fetch list of conversations
  useEffect(() => {
    if (!currentUser) return;
    
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatsData = [];
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const otherUserId = data.participants.find(id => id !== currentUser.uid);
        
        // Fetch other user's profile info
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
      setChats(chatsData);
      setLoadingChats(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Fetch current chat details and messages
  useEffect(() => {
    if (!chatId || !currentUser) {
      setMessages([]);
      setChatUser(null);
      return;
    }

    // Determine other user ID from chatId
    const otherUserId = chatId.split('_').find(id => id !== currentUser.uid);
    if (otherUserId) {
      getDoc(doc(db, 'users', otherUserId)).then(snap => {
        if (snap.exists()) setChatUser(snap.data());
      });
    }

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsubscribe();
  }, [chatId, currentUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !chatId) return;

    const text = newMessage;
    setNewMessage('');

    try {
      // Ensure chat document exists
      const chatRef = doc(db, 'chats', chatId);
      await setDoc(chatRef, {
        participants: chatId.split('_'),
        lastMessage: text,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Add message
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
    <div className="pt-16 pb-20 md:pb-0 min-h-screen bg-surface-container-lowest flex h-screen overflow-hidden">
      
      {/* Sidebar - Chat List */}
      <div className={`w-full md:w-80 border-r border-outline-variant bg-surface flex flex-col h-full ${chatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-outline-variant">
          <h2 className="font-title-lg font-bold text-on-surface">Messaging</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
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
                onClick={() => navigate(`/messages/${chat.id}`)}
                className={`p-4 border-b border-outline-variant/50 cursor-pointer flex gap-3 hover:bg-surface-container-low transition-colors ${chatId === chat.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
              >
                <img src={chat.otherUser?.photoURL || "https://ui-avatars.com/api/?name=User"} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
                <div className="overflow-hidden">
                  <h3 className="font-label-md font-bold text-on-surface truncate">{chat.otherUser?.displayName || chat.otherUser?.name || 'User'}</h3>
                  <p className="text-body-sm text-on-surface-variant truncate mt-0.5">{chat.lastMessage}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className={`flex-1 flex flex-col h-full bg-surface-container-lowest ${!chatId ? 'hidden md:flex' : 'flex'}`}>
        {!chatId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant p-8 text-center">
            <span className="material-symbols-outlined text-6xl mb-4 text-outline-variant">forum</span>
            <h2 className="font-title-lg text-on-surface font-bold">Your Messages</h2>
            <p className="text-body-md mt-2 max-w-sm">Select a conversation from the sidebar or start a new one from someone's profile.</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-16 px-4 border-b border-outline-variant bg-surface flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/messages')} className="md:hidden p-2 rounded-full hover:bg-surface-container-low">
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                {chatUser && (
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/profile/view/${chatId.split('_').find(id => id !== currentUser.uid)}`)}>
                    <img src={chatUser.photoURL || "https://ui-avatars.com/api/?name=User"} className="w-10 h-10 rounded-full object-cover" alt="" />
                    <div>
                      <h3 className="font-label-md font-bold text-on-surface">{chatUser.displayName || chatUser.name}</h3>
                      <p className="text-[11px] text-on-surface-variant font-medium">{chatUser.role}</p>
                    </div>
                  </div>
                )}
              </div>
              <button className="p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-container-lowest">
              {messages.map((msg) => {
                const isMe = msg.senderId === currentUser.uid;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isMe 
                        ? 'bg-primary text-white rounded-br-sm' 
                        : 'bg-surface-container text-on-surface rounded-bl-sm border border-outline-variant'
                    }`}>
                      <p className="text-body-md">{msg.text}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-surface border-t border-outline-variant pb-24 md:pb-4">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2 max-w-4xl mx-auto">
                <div className="flex-1 bg-surface-container-lowest border border-outline rounded-2xl flex items-center p-1 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                  <button type="button" className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full shrink-0">
                    <span className="material-symbols-outlined">add_circle</span>
                  </button>
                  <textarea 
                    rows={1}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="Write a message..."
                    className="flex-1 bg-transparent border-none outline-none resize-none px-2 py-2.5 max-h-32 text-body-md"
                  />
                  <button type="button" className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full shrink-0">
                    <span className="material-symbols-outlined">mood</span>
                  </button>
                </div>
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined font-bold">send</span>
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
