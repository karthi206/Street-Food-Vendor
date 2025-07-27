import React, { useState } from 'react';
import { Send, MessageCircle, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export default function Messages() {
  const { user } = useAuth();
  const { getMessagesByUser, addMessage, markMessageAsRead } = useData();
  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  const messages = getMessagesByUser(user?.id || '');
  
  // Group messages by contact
  const messagesByContact = messages.reduce((acc, message) => {
    const otherUserId = message.fromId === user?.id ? message.toId : message.fromId;
    const otherUserName = message.fromId === user?.id ? message.toName : message.fromName;
    
    if (!acc[otherUserId]) {
      acc[otherUserId] = {
        userId: otherUserId,
        userName: otherUserName,
        messages: []
      };
    }
    acc[otherUserId].messages.push(message);
    return acc;
  }, {} as Record<string, any>);

  // Sort contacts by latest message
  const sortedContacts = Object.values(messagesByContact).sort((a: any, b: any) => {
    const latestA = new Date(a.messages[a.messages.length - 1]?.timestamp || 0);
    const latestB = new Date(b.messages[b.messages.length - 1]?.timestamp || 0);
    return latestB.getTime() - latestA.getTime();
  });

  const selectedContactData = selectedContact ? messagesByContact[selectedContact] : null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    const contactData = messagesByContact[selectedContact];
    addMessage({
      fromId: user?.id || '',
      toId: selectedContact,
      fromName: user?.name || '',
      toName: contactData.userName,
      message: newMessage.trim(),
      read: false
    });

    setNewMessage('');
  };

  const getUnreadCount = (contactId: string) => {
    const contact = messagesByContact[contactId];
    return contact?.messages.filter((msg: any) => !msg.read && msg.toId === user?.id).length || 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-96">
      <div className="flex h-full">
        {/* Contacts List */}
        <div className="w-1/3 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Messages</h3>
          </div>
          
          <div className="overflow-y-auto">
            {sortedContacts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No messages yet</p>
                <p className="text-xs">Start a conversation with suppliers</p>
              </div>
            ) : (
              sortedContacts.map((contact: any) => {
                const unreadCount = getUnreadCount(contact.userId);
                const lastMessage = contact.messages[contact.messages.length - 1];
                
                return (
                  <button
                    key={contact.userId}
                    onClick={() => {
                      setSelectedContact(contact.userId);
                      // Mark messages as read
                      contact.messages
                        .filter((msg: any) => !msg.read && msg.toId === user?.id)
                        .forEach((msg: any) => markMessageAsRead(msg.id));
                    }}
                    className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      selectedContact === contact.userId ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{contact.userName}</span>
                      {unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    {lastMessage && (
                      <div>
                        <p className="text-sm text-gray-600 truncate">
                          {lastMessage.fromId === user?.id ? 'You: ' : ''}
                          {lastMessage.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(lastMessage.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedContactData ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center">
                <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <h4 className="font-medium text-gray-900">{selectedContactData.userName}</h4>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedContactData.messages.map((message: any) => {
                  const isFromMe = message.fromId === user?.id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                          isFromMe
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          isFromMe ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}