import React, { useState, useEffect } from "react";
import { useUserData } from "../hooks/useUserData";
import { useAuth } from "../contexts/AuthContext";
import PokerBackground from "../components/PokerBackground";

export default function StudyGroups() {
  const { user } = useAuth();
  const { data: groups = [], loading, addItem, updateItem } = useUserData("groups");
  const [newGroup, setNewGroup] = useState("");
  const [newMessage, setNewMessage] = useState({});
  const [selectedGroup, setSelectedGroup] = useState(null);

  const addGroup = async () => {
    if (newGroup.trim() === "") return;
    try {
      await addItem({ 
        name: newGroup.trim(), 
        members: [user?.email || 'user'],
        messages: [],
        createdAt: new Date().toISOString()
      });
      setNewGroup("");
    } catch (error) {
      console.error('Add group failed:', error);
      alert('Failed to create group');
    }
  };

  const sendMessage = async (groupId) => {
    const messageText = newMessage[groupId]?.trim();
    if (!messageText) return;
    
    try {
      const group = groups.find(g => g.id === groupId);
      const updatedMessages = [
        ...(group.messages || []),
        {
          user: user?.email?.split('@')[0] || 'You',
          text: messageText,
          timestamp: new Date().toISOString()
        }
      ];
      await updateItem(groupId, { messages: updatedMessages });
      setNewMessage({ ...newMessage, [groupId]: "" });
    } catch (error) {
      console.error('Send message failed:', error);
      alert('Failed to send message');
    }
  };

  const joinGroup = async (groupId) => {
    try {
      const group = groups.find(g => g.id === groupId);
      const currentMembers = group.members || [];
      if (!currentMembers.includes(user?.email)) {
        await updateItem(groupId, { 
          members: [...currentMembers, user?.email || 'user']
        });
      }
    } catch (error) {
      console.error('Join group failed:', error);
      alert('Failed to join group');
    }
  };

  if (loading) return (
    <div className="min-h-screen relative flex items-center justify-center">
      <PokerBackground />
      <div className="relative z-10 text-center" style={{ color: 'var(--poker-text)' }}>
        Loading groups...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      <PokerBackground />
      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-6">
        <div
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: 'var(--poker-text)' }}>
              Study Groups
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--poker-muted)' }}>
              Lightweight spaces to type and share updates with friends.
            </p>
          </div>
        </div>

        {/* Add Group */}
        <div className="flex mb-6 gap-2">
          <input
            type="text"
            className="poker-input flex-1 rounded-l-lg"
            placeholder="Create a new study group..."
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addGroup()}
          />
          <button onClick={addGroup} className="poker-button rounded-r-lg px-6">
            Create Group
          </button>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          {groups.map((group, index) => {
            const isMember = group.members?.includes(user?.email);
            const messages = group.messages || [];
            return (
              <div 
                key={group.id} 
                className="poker-card blue p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--poker-gold)' }}>
                      {group.name}
                    </h3>
                    <p className="text-sm opacity-70">
                      {group.members?.length || 0} member{group.members?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  {!isMember && (
                    <button
                      onClick={() => joinGroup(group.id)}
                      className="poker-button secondary text-xs px-3 py-1"
                    >
                      Join
                    </button>
                  )}
                </div>
                
                {/* Messages */}
                <div className="h-32 overflow-y-auto poker-input p-3 rounded-lg mb-3">
                  {messages.length > 0 ? (
                    messages.slice(-5).map((msg, i) => (
                      <div key={i} className="text-sm mb-2">
                        <span style={{ color: 'var(--poker-accent)', fontWeight: 'bold' }}>
                          {msg.user}:
                        </span>{' '}
                        <span>{msg.text}</span>
                        {msg.timestamp && (
                          <span className="text-xs opacity-50 ml-2">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm opacity-50">No messages yet</p>
                  )}
                </div>

                {/* Message Input */}
                {isMember && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="poker-input flex-1 text-sm"
                      placeholder="Type a message..."
                      value={newMessage[group.id] || ""}
                      onChange={(e) => setNewMessage({ ...newMessage, [group.id]: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage(group.id)}
                    />
                    <button
                      onClick={() => sendMessage(group.id)}
                      className="poker-button text-sm px-3"
                    >
                      Send
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {groups.length === 0 && (
          <p 
            className="text-center mt-8 text-lg"
            style={{ color: 'var(--poker-text)', opacity: 0.7 }}
          >
            No groups yet—create one above.
          </p>
        )}
      </div>
    </div>
  );
}
