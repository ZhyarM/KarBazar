import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getConversations, getMessages, sendMessage } from "../API/MessagesAPI";
import type { Message, Conversation } from "../API/MessagesAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faArrowLeft,
  faSearch,
  faEnvelope,
  faPaperclip,
  faXmark,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";
import { getAvatarUrl } from "../utils/imageUrl";
import { useLanguage } from "../context/LanguageContext.tsx";
import { uploadMessageAttachment } from "../API/UploadAPI";

interface SellerInfo {
  id: number;
  name: string;
  username: string;
  avatar_url?: string | null;
}

function Messages() {
  const { t, language, direction } = useLanguage();
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewConversation, setIsNewConversation] = useState(!!sellerFromState);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const supportedFilePattern =
    /\.(jpg|jpeg|png|gif|webp|svg|pdf|doc|docx|xls|xlsx|txt|zip|rar|mp4|mov|avi|mp3|wav)$/i;

  const getAttachmentList = (attachments: Message["attachments"]) => {
    if (!attachments) {
      return [];
    }

    return Array.isArray(attachments) ? attachments : [attachments];
  };

  const isImageAttachment = (attachment: string) =>
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(attachment);

  const resolveAttachmentUrl = (attachment: string) => {
    if (attachment.startsWith("http")) {
      return attachment;
    }

    const apiBase =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
    const appBase = apiBase.replace(/\/api\/?$/, "");

    if (attachment.startsWith("/storage/")) {
      return `${appBase}${attachment}`;
    }

    if (attachment.startsWith("storage/")) {
      return `${appBase}/${attachment}`;
    }

    return `${appBase}/storage/${attachment}`;
  };

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => {
      const isValidType = supportedFilePattern.test(file.name);
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert(t("messages.fileInvalid"));
    }

    setSelectedFiles((prev) => [...prev, ...validFiles].slice(0, 5));
    event.target.value = "";
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) =>
      prev.filter((_, fileIndex) => fileIndex !== index),
    );
  };

  const uploadSelectedFiles = async () => {
    const uploadedUrls: string[] = [];

    for (const file of selectedFiles) {
      const uploadedUrl = await uploadMessageAttachment(file);
      uploadedUrls.push(uploadedUrl);
    }

    return uploadedUrls;
  };

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
      (!newMessage.trim() && selectedFiles.length === 0) ||
      !selectedUserId ||
      selectedUserId === 0 ||
      sending
    )
      return;

    setSending(true);
    try {
      const attachmentUrls =
        selectedFiles.length > 0 ? await uploadSelectedFiles() : [];

      await sendMessage(selectedUserId, newMessage, attachmentUrls);
      setNewMessage("");
      setSelectedFiles([]);
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
      alert(error instanceof Error ? error.message : t("messages.sendFailed"));
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
      return date.toLocaleTimeString(language === "ku" ? "ku" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return t("messages.yesterday");
    } else if (days < 7) {
      return `${days}d`;
    } else {
      return date.toLocaleDateString(language === "ku" ? "ku" : "en-US", {
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
    <div className="flex h-screen bg-(--color-bg)" dir={direction}>
      {/* Sidebar - Conversations List */}
      <div
        className={`${selectedUserId ? "hidden md:flex" : "flex"} w-full md:w-80 flex-col border-r border-(--color-border) bg-(--color-surface)`}
      >
        {/* Header */}
        <div className="p-4 border-b border-(--color-border)">
          <h1 className="text-xl font-bold text-(--color-text) mb-4">
            {t("messages.title")}
          </h1>

          {/* Search */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-3 text-(--color-text-muted)"
            />
            <input
              type="text"
              placeholder={t("messages.search")}
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
                  ? t("messages.noSearch")
                  : t("messages.noConversations")}
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
              <p className="text-lg">{t("messages.selectConversation")}</p>
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
                          : t("messages.startConversation")}
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
                      {t("messages.dmBeginning")}{" "}
                      {selectedUserInfo && "user" in selectedUserInfo
                        ? selectedUserInfo.user.name
                        : selectedUserInfo && "name" in selectedUserInfo
                          ? selectedUserInfo.name
                          : t("messages.thisUser")}
                      . {t("messages.sendToStart")}
                    </p>
                    <div className="space-y-3">
                      <p className="text-(--color-text-muted) text-xs">
                        {t("messages.tip")}
                      </p>
                    </div>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-(--color-text-muted)">
                  <p className="text-sm">{t("messages.noMessages")}</p>
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
                        {getAttachmentList(msg.attachments).length > 0 && (
                          <div className="mt-2 space-y-2">
                            {getAttachmentList(msg.attachments).map(
                              (attachment) => {
                                const attachmentUrl =
                                  resolveAttachmentUrl(attachment);
                                const imageAttachment =
                                  isImageAttachment(attachment);

                                return imageAttachment ? (
                                  <button
                                    key={attachment}
                                    type="button"
                                    onClick={() =>
                                      window.open(attachmentUrl, "_blank")
                                    }
                                    className="block w-full text-left"
                                  >
                                    <img
                                      src={attachmentUrl}
                                      alt={t("messages.attachmentImage")}
                                      className="max-w-full rounded-md max-h-48 object-cover cursor-pointer"
                                    />
                                  </button>
                                ) : (
                                  <a
                                    key={attachment}
                                    href={attachmentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-xs underline break-all"
                                  >
                                    <FontAwesomeIcon icon={faFileLines} />
                                    <span>{t("messages.viewAttachment")}</span>
                                  </a>
                                );
                              },
                            )}
                          </div>
                        )}
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
              {selectedFiles.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => {
                    const previewUrl = URL.createObjectURL(file);
                    const fileIsImage = file.type.startsWith("image/");

                    return (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center gap-2 rounded-lg border border-(--color-border) bg-(--color-bg) px-2 py-1 max-w-full"
                      >
                        {fileIsImage ? (
                          <img
                            src={previewUrl}
                            alt={file.name}
                            className="w-10 h-10 rounded-md object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-(--color-primary)/10 flex items-center justify-center text-(--color-primary)">
                            <FontAwesomeIcon icon={faFileLines} />
                          </div>
                        )}
                        <div className="min-w-0 max-w-[220px]">
                          <p className="text-xs text-(--color-text) truncate">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-(--color-text-muted)">
                            {(file.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSelectedFile(index)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-(--color-text-muted) hover:text-red-500 hover:bg-red-500/10"
                        >
                          <FontAwesomeIcon icon={faXmark} className="text-xs" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex gap-2 items-end">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar,.mp4,.mov,.avi,.mp3,.wav"
                  onChange={handleFileSelection}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-11 w-11 shrink-0 rounded-lg border border-(--color-border) bg-(--color-bg) text-(--color-text) hover:border-(--color-primary) hover:text-(--color-primary) transition-colors flex items-center justify-center"
                  aria-label={t("messages.attachFile")}
                >
                  <FontAwesomeIcon icon={faPaperclip} />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t("messages.typeMessage")}
                  className="flex-1 px-4 py-2 rounded-lg bg-(--color-bg) border border-(--color-border) text-(--color-text) placeholder:text-(--color-text-muted) focus:outline-none focus:border-(--color-primary)"
                />
                <button
                  type="submit"
                  disabled={
                    sending ||
                    (!newMessage.trim() && selectedFiles.length === 0) ||
                    !selectedUserId ||
                    selectedUserId === 0
                  }
                  className="px-6 py-2 bg-(--color-primary) text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {sending ? (
                    <span>{t("messages.sending")}</span>
                  ) : (
                    <FontAwesomeIcon icon={faPaperPlane} />
                  )}
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
