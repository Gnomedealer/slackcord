import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { messageSent } from "../features/chatSlice";
import { selectActiveChannel, selectChannelMessages, selectCurrentUser, selectUsers } from "../features/selectors";
import { formatDayLabel, isSameDay } from "../utils/format";
import Composer from "./Composer";
import { HashIcon, MenuIcon, SearchIcon, UsersIcon } from "./Icons";
import Message from "./Message";

const GROUP_WINDOW = 5 * 60 * 1000; // messages within 5 minutes by the same person are grouped

function ChatArea({ onOpenMenu, showMembers, onToggleMembers }) {
  const dispatch = useDispatch();
  const channel = useSelector(selectActiveChannel);
  const messages = useSelector(selectChannelMessages);
  const users = useSelector(selectUsers);
  const me = useSelector(selectCurrentUser);
  const allMessages = useSelector((state) => state.chat.messages);

  const [replyTo, setReplyTo] = useState(null);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const bottomRef = useRef(null);

  // Reset reply/search when switching channels.
  useEffect(() => {
    setReplyTo(null);
    setSearch("");
    setSearchOpen(false);
  }, [channel?.id]);

  // Jump to the newest message when the list grows or the channel changes.
  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ block: "end" });
  }, [messages.length, channel?.id]);

  if (!channel) {
    return (
      <main className="chat empty-chat">
        <button className="icon-btn menu-btn" aria-label="Open menu" onClick={onOpenMenu}>
          <MenuIcon />
        </button>
        <p>Create a server to start chatting.</p>
      </main>
    );
  }

  const query = search.trim().toLowerCase();
  const visible = query ? messages.filter((m) => m.body.toLowerCase().includes(query)) : messages;

  function send(body) {
    dispatch(messageSent({ channelId: channel.id, authorId: me.id, body, replyToId: replyTo?.id }));
    setReplyTo(null);
  }

  return (
    <main className="chat">
      <header className="chat-head">
        <button className="icon-btn menu-btn" aria-label="Open menu" onClick={onOpenMenu}>
          <MenuIcon />
        </button>
        <HashIcon className="chat-hash" />
        <h2>{channel.name}</h2>
        {channel.topic && <p className="topic">{channel.topic}</p>}
        <div className="chat-head-actions">
          {searchOpen && (
            <input
              className="search-input"
              type="search"
              placeholder="Search this channel"
              aria-label="Search messages"
              value={search}
              autoFocus
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
          <button
            className={`icon-btn ${searchOpen ? "on" : ""}`}
            aria-label="Search messages"
            aria-pressed={searchOpen}
            onClick={() => {
              setSearchOpen((o) => !o);
              setSearch("");
            }}
          >
            <SearchIcon />
          </button>
          <button
            className={`icon-btn members-toggle ${showMembers ? "on" : ""}`}
            aria-label="Toggle member list"
            aria-pressed={showMembers}
            onClick={onToggleMembers}
          >
            <UsersIcon />
          </button>
        </div>
      </header>

      <div className="messages-scroll">
        {query ? (
          <p className="search-summary">
            {visible.length} result{visible.length === 1 ? "" : "s"} for “{search.trim()}”
          </p>
        ) : (
          <div className="channel-intro">
            <span className="intro-hash">
              <HashIcon size={36} />
            </span>
            <h3>Welcome to #{channel.name}!</h3>
            <p>This is the start of the #{channel.name} channel.</p>
          </div>
        )}

        <ul className="message-list" aria-label={`Messages in ${channel.name}`}>
          {visible.map((message, i) => {
            const prev = visible[i - 1];
            const newDay = !prev || !isSameDay(prev.createdAt, message.createdAt);
            const compact =
              !query &&
              !newDay &&
              !message.replyToId &&
              prev.authorId === message.authorId &&
              message.createdAt - prev.createdAt < GROUP_WINDOW;
            const author = users[message.authorId] || { id: "?", name: "Unknown user", color: "#64748b" };

            return (
              <Fragment key={message.id}>
                {newDay && (
                  <li className="day-divider" role="separator">
                    <span>{formatDayLabel(message.createdAt)}</span>
                  </li>
                )}
                <Message
                  message={message}
                  author={author}
                  me={me}
                  users={users}
                  compact={compact}
                  parent={message.replyToId ? allMessages[message.replyToId] : null}
                  onReply={setReplyTo}
                />
              </Fragment>
            );
          })}
        </ul>
        <div ref={bottomRef} />
      </div>

      <Composer
        channelName={channel.name}
        replyTo={replyTo}
        replyAuthor={replyTo ? users[replyTo.authorId]?.name : ""}
        onCancelReply={() => setReplyTo(null)}
        onSend={send}
      />
    </main>
  );
}

export default ChatArea;
