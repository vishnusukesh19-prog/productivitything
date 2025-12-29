import React, { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useUserData } from "../hooks/useUserData";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { UserGroupIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function StudyGroups() {
  const { user } = useAuth();
  const {
    data: groups = [],
    loading,
    addItem,
    updateItem,
  } = useUserData("groups");
  const [newGroup, setNewGroup] = useState("");
  const [newMessage, setNewMessage] = useState({});
  const [joinCode, setJoinCode] = useState("");

  const addGroup = async () => {
    if (newGroup.trim() === "") return;
    try {
      const code = Math.random().toString(36).slice(2, 8).toUpperCase();
      await addItem({
        name: newGroup.trim(),
        code,
        members: [user?.email || "user"],
        messages: [],
      });
      setNewGroup("");
    } catch (error) {
      console.error("Add group failed:", error);
      alert("Failed to create group");
    }
  };

  const sendMessage = async (groupId) => {
    const messageText = newMessage[groupId]?.trim();
    if (!messageText) return;

    try {
      const group = groups.find((g) => g.id === groupId);
      const updatedMessages = [
        ...(group.messages || []),
        {
          user: user?.email?.split("@")[0] || "You",
          text: messageText,
          timestamp: new Date().toISOString(),
        },
      ];
      await updateItem(groupId, { messages: updatedMessages });
      setNewMessage({ ...newMessage, [groupId]: "" });
    } catch (error) {
      console.error("Send message failed:", error);
      alert("Failed to send message");
    }
  };

  const joinGroupById = async (groupId) => {
    try {
      const group = groups.find((g) => g.id === groupId);
      const currentMembers = group.members || [];
      if (!currentMembers.includes(user?.email)) {
        await updateItem(groupId, {
          members: [...currentMembers, user?.email || "user"],
        });
      }
    } catch (error) {
      console.error("Join group failed:", error);
      alert("Failed to join group");
    }
  };

  const joinGroupByCode = async () => {
    const code = joinCode.trim().toUpperCase();
    if (!code) return;
    try {
      const groupsRef = collection(db, "groups");
      const q = query(groupsRef, where("code", "==", code));
      const snap = await getDocs(q);
      if (snap.empty) {
        alert("No group found with that code");
        return;
      }
      const docSnap = snap.docs[0];
      const groupData = docSnap.data();
      const currentMembers = groupData.members || [];
      if (!currentMembers.includes(user?.email)) {
        await updateItem(docSnap.id, {
          members: [...currentMembers, user?.email || "user"],
        });
      }
      setJoinCode("");
      alert("Joined group!");
    } catch (error) {
      console.error("Join by code failed:", error);
      alert("Failed to join by code");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center text-gray-600 dark:text-gray-400">
          Loading groups...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 md:p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="section-header">Study Groups</h1>
            <p className="section-subtitle">
              Share progress with friends using join codes.
            </p>
          </div>
        </div>

        {/* Create + Join by code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="card p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
              Create a group
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                className="input flex-1"
                placeholder="New study group name..."
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addGroup()}
              />
              <button
                onClick={addGroup}
                className="btn-primary px-4 whitespace-nowrap"
              >
                <PlusIcon className="w-4 h-4 inline mr-1" />
                Create
              </button>
            </div>
          </div>

          <div className="card p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
              Join with code
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                className="input flex-1"
                placeholder="Enter join code..."
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && joinGroupByCode()}
              />
              <button
                onClick={joinGroupByCode}
                className="btn-secondary px-4 whitespace-nowrap"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          {groups.map((group) => {
            const isMember = group.members?.includes(user?.email);
            const messages = group.messages || [];
            return (
              <div key={group.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-gray-50">
                      {group.name}
                    </h3>
                    <p className="text-xs mb-1 text-gray-600 dark:text-gray-400">
                      Join code:{" "}
                      <span className="font-mono text-primary-500">
                        {group.code || "—"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {group.members?.length || 0} member
                      {group.members?.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {!isMember && (
                    <button
                      onClick={() => joinGroupById(group.id)}
                      className="btn-secondary text-xs px-3 py-1"
                    >
                      Join
                    </button>
                  )}
                </div>

                {/* Messages */}
                <div className="h-32 overflow-y-auto input p-3 rounded-lg mb-3 bg-gray-50 dark:bg-gray-800">
                  {messages.length > 0 ? (
                    messages.slice(-5).map((msg, i) => (
                      <div key={i} className="text-sm mb-2 text-gray-900 dark:text-gray-50">
                        <span className="font-bold text-primary-500">
                          {msg.user}:
                        </span>{" "}
                        <span>{msg.text}</span>
                        {msg.timestamp && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No messages yet</p>
                  )}
                </div>

                {/* Message Input */}
                {isMember && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input flex-1 text-sm"
                      placeholder="Type a message..."
                      value={newMessage[group.id] || ""}
                      onChange={(e) =>
                        setNewMessage({
                          ...newMessage,
                          [group.id]: e.target.value,
                        })
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && sendMessage(group.id)
                      }
                    />
                    <button
                      onClick={() => sendMessage(group.id)}
                      className="btn-primary text-sm px-3"
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
          <p className="text-center mt-8 text-lg text-gray-600 dark:text-gray-400">
            No groups yet—create one above or join with a code.
          </p>
        )}
      </div>
    </div>
  );
}
