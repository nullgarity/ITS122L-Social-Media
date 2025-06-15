import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import api from '../api/axios';
import './Messenger.css';

export default function Messenger() {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get('/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        navigate('/login');
      }
    };

    fetchUser();
    fetchConversations();
  }, [navigate]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('authToken');
      // This is a mock implementation since the API might not have messaging yet
      const mockConversations = [
        {
          id: 1,
          participant: {
            id: 'user-1',
            name: 'John Doe',
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'
          },
          lastMessage: 'Hey, how are you?',
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          participant: {
            id: 'user-2',
            name: 'Jane Smith',
            avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop'
          },
          lastMessage: 'See you tomorrow!',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      setConversations(mockConversations);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      // Mock messages implementation
      const mockMessages = [
        {
          id: 1,
          content: 'Hey, how are you?',
          senderId: 'user-1',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          isOwn: false
        },
        {
          id: 2,
          content: 'I\'m doing great! How about you?',
          senderId: user?.id,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isOwn: true
        },
        {
          id: 3,
          content: 'That\'s awesome to hear!',
          senderId: 'user-1',
          timestamp: new Date().toISOString(),
          isOwn: false
        }
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
  };

  const handleSendMessage = async (content) => {
    if (!selectedConversation || !content.trim()) return;

    try {
      const newMessage = {
        id: Date.now(),
        content,
        senderId: user?.id,
        timestamp: new Date().toISOString(),
        isOwn: true
      };

      setMessages(prev => [...prev, newMessage]);
      
      // Here you would normally send to API
      // await api.post('/messages', { conversationId: selectedConversation.id, content });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!user || loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="messenger-container">
      <NavBar user={user} />
      <div className="messenger-content">
        <div className="conversations-sidebar">
          <div className="sidebar-header">
            <h2>Chats</h2>
          </div>
          <div className="conversations-list">
            {conversations.map(conversation => (
              <div
                key={conversation.id}
                className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                onClick={() => handleConversationSelect(conversation)}
              >
                <img
                  src={conversation.participant.avatar}
                  alt={conversation.participant.name}
                  className="conversation-avatar"
                />
                <div className="conversation-info">
                  <div className="conversation-name">{conversation.participant.name}</div>
                  <div className="conversation-last-message">{conversation.lastMessage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-area">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <img
                  src={selectedConversation.participant.avatar}
                  alt={selectedConversation.participant.name}
                  className="chat-avatar"
                />
                <div className="chat-participant-name">
                  {selectedConversation.participant.name}
                </div>
              </div>
              <MessageList messages={messages} currentUserId={user.id} />
              <MessageInput onSendMessage={handleSendMessage} />
            </>
          ) : (
            <div className="no-conversation-selected">
              <h3>Select a conversation to start messaging</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
