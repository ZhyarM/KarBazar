import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getConversations, getMessages, sendMessage } from "../API/MessagesAPI";
import type { Message, Conversation } from "../API/MessagesAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faArrowLeft,
  faSearch,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { getAvatarUrl } from "../utils/imageUrl";

interface SellerInfo {
  id: number;
  name: string;
  username: string;
  avatar_url?: string | null;
}

function Messages() {
  const { userId: urlUserId } = useParams<{ userId?: string }>();
  const location = useLocation();
  const sellerFromState = (location.state as any)?.seller as
    | SellerInfo
    | undefined;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(
    sellerFromState?.id || (urlUserId ? Number(urlUserId) : null),
  );
  const [selectedUserInfo, setSelectedUserInfo] = useState<
    SellerInfo | Conversation | null
  >(sellerFromState || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewConversation, setIsNewConversation] = useState(!!sellerFromState);

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Initial load of conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        const data = await getConversations();
        setConversations(data);

        // If user ID is set, find existing conversation or mark as new
        if (selectedUserId) {
          const existingConv = data.find(
            (conv) => conv.user.id === selectedUserId,
          );
          if (existingConv) {
            setSelectedUserInfo(existingConv);
            setIsNewConversation(false);
          }
        }
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  // Load messages when user is selected
  useEffect(() => {
    if (selectedUserId && selectedUserId > 0 && !isNewConversation) {
      const loadMessages = async () => {
        try {
          const data = await getMessages(selectedUserId);
          setMessages(data);
        } catch (error) {
          console.log("Starting new conversation...");
          setMessages([]);
        }
      };

      loadMessages();

      // Set up polling for new messages
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUserId, isNewConversation]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedUserId(conversation.user.id);
    setSelectedUserInfo(conversation);
    setIsNewConversation(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newMessage.trim() ||
      !selectedUserId ||
      selectedUserId === 0 ||
      sending
    )
      return;

    setSending(true);
    try {
      await sendMessage(selectedUserId, newMessage);
      setNewMessage("");
      setIsNewConversation(false);

      // Reload messages and conversations
      const [messagesData, conversationsData] = await Promise.all([
        getMessages(selectedUserId),
        getConversations(),
      ]);

      setMessages(messagesData);
      setConversations(conversationsData);

      // Update selected user info
      const updatedUser = conversationsData.find(
        (conv) => conv.user.id === selectedUserId,
      );
      if (updatedUser) {
        setSelectedUserInfo(updatedUser);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days}d`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-(--color-bg)">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-primary)"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-(--color-bg)">
      {/* Sidebar - Conversations List */}
      <div
        className={`${selectedUserId ? "hidden md:flex" : "flex"} w-full md:w-80 flex-col border-r border-(--color-border) bg-(--color-surface)`}
      >
        {/* Header */}
        <div className="p-4 border-b border-(--color-border)">
          <h1 className="text-xl font-bold text-(--color-text) mb-4">
            Messages
          </h1>

          {/* Search */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-3 text-(--color-text-muted)"
            />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-primary)"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-(--color-text-muted)">
              <p className="text-sm">
                {searchQuery
                  ? "No conversations match your search"
                  : "No conversations yet. Start messaging sellers!"}
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.user.id}
                onClick={() => handleSelectConversation(conv)}
                className={`p-3 md:p-4 border-b border-(--color-border) cursor-pointer transition-colors ${
                  selectedUserId === conv.user.id
                    ? "bg-(--color-bg)"
                    : "hover:bg-(--color-bg-muted)"
                }`}
              >
                <div className="flex items-center gap-3">
                  {getAvatarUrl(conv.user.image) ? (
                    <img
                      src={getAvatarUrl(conv.user.image)}
                      alt={conv.user.name}
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <span className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center bg-(--color-primary) text-white font-bold text-lg">
                      {conv.user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="font-semibold text-(--color-text) truncate">
                        {conv.user.name}
                      </h3>
                      <span className="text-xs text-(--color-text-muted) shrink-0">
                        {formatTime(conv.last_message.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-(--color-text-muted) truncate">
                      {conv.last_message.content}
                    </p>
                  </div>
                  {conv.unread_count > 0 && (
                    <span className="bg-(--color-primary) text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                      {conv.unread_count}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`${!selectedUserId ? "hidden md:flex" : "flex"} flex-1 flex-col`}
      >
        {!selectedUserId ? (
          <div className="flex-1 flex items-center justify-center bg-(--color-bg)">
            <div className="text-center text-(--color-text-muted)">
              <p className="text-lg">
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-(--color-border) bg-(--color-surface) flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedUserId(null);
                  setSelectedUserInfo(null);
                }}
                className="md:hidden text-(--color-text) text-lg"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>

              {selectedUserInfo && (
                <>
                  {(() => {
                    const avatarSrc = getAvatarUrl(
                      "user" in selectedUserInfo
                        ? selectedUserInfo.user.image
                        : selectedUserInfo.avatar_url,
                    );
                    const name =
                      "user" in selectedUserInfo
                        ? selectedUserInfo.user.name
                        : selectedUserInfo.name;
                    return avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt={name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="w-10 h-10 rounded-full flex items-center justify-center bg-(--color-primary) text-white font-bold">
                        {name.charAt(0).toUpperCase()}
                      </span>
                    );
                  })()}
                  <div className="flex-1">
                    <h2 className="font-semibold text-(--color-text)">
                      {"user" in selectedUserInfo
                        ? selectedUserInfo.user.name
                        : selectedUserInfo.name}
                    </h2>
                    <p className="text-xs text-(--color-text-muted)">
                      @
                      {"user" in selectedUserInfo
                        ? selectedUserInfo.user.profile?.username ||
                          selectedUserInfo.user.name
                        : selectedUserInfo.username}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 bg-(--color-bg) space-y-4 flex flex-col justify-end">
              {isNewConversation ? (
                <div className="text-center space-y-6 flex flex-col items-center justify-center pb-8">
                  <div className="bg-(--color-surface) border border-(--color-border) rounded-full p-8">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-5xl text-(--color-primary)"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-(--color-text) mb-2">
                      {selectedUserInfo && "user" in selectedUserInfo
                        ? selectedUserInfo.user.name
                        : selectedUserInfo && "name" in selectedUserInfo
                          ? selectedUserInfo.name
                          : "Start a conversation"}
                    </h2>
                    {selectedUserInfo && (
                      <p className="text-(--color-text-muted) text-sm">
                        @
                        {"user" in selectedUserInfo
                          ? selectedUserInfo.user.profile?.username ||
                            selectedUserInfo.user.name
                          : selectedUserInfo.username}
                      </p>
                    )}
                  </div>
                  <div className="bg-(--color-surface) border border-(--color-border) rounded-lg p-6 max-w-md w-full">
                    <p className="text-(--color-text) text-sm mb-4">
                      This is the beginning of your direct message with{" "}
                      {selectedUserInfo && "user" in selectedUserInfo
                        ? selectedUserInfo.user.name
                        : selectedUserInfo && "name" in selectedUserInfo
                          ? selectedUserInfo.name
                          : "this user"}
                      . Send a message to start the conversation!
                    </p>
                    <div className="space-y-3">
                      <p className="text-(--color-text-muted) text-xs">
                        💡 Tip: Be clear about what you're inquiring about
                      </p>
                    </div>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-(--color-text-muted)">
                  <p className="text-sm">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwnMessage = msg.sender_id === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          isOwnMessage
                            ? "bg-(--color-primary) text-white"
                            : "bg-(--color-surface) text-(--color-text)"
                        }`}
                      >
                        <p className="wrap-break-word text-sm">{msg.content}</p>
                        {msg.attachments &&
                          (() => {
                            const attachmentUrl = msg.attachments.startsWith(
                              "http",
                            )
                              ? msg.attachments
                              : `http://localhost:8000/storage/${msg.attachments}`;
                            const isImage =
                              /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(
                                msg.attachments,
                              );
                            return isImage ? (
                              <img
                                src={attachmentUrl}
                                alt="Attachment"
                                className="mt-2 max-w-full rounded-md max-h-48 object-cover cursor-pointer"
                                onClick={() =>
                                  window.open(attachmentUrl, "_blank")
                                }
                              />
                            ) : (
                              <a
                                href={attachmentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs underline mt-1 block"
                              >
                                📎 View Attachment
                              </a>
                            );
                          })()}
                        <p
                          className={`text-xs mt-1 ${
                            isOwnMessage
                              ? "text-white/70"
                              : "text-(--color-text-muted)"
                          }`}
                        >
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-(--color-border) bg-(--color-surface)"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-primary)"
                />
                <button
                  type="submit"
                  disabled={
                    sending ||
                    !newMessage.trim() ||
                    !selectedUserId ||
                    selectedUserId === 0
                  }
                  className="px-6 py-2 bg-(--color-primary) text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Messages;
