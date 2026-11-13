import { useState } from "react";
import { useDispatch } from "react-redux";
import { messageDeleted, messageEdited, reactionToggled } from "../features/chatSlice";
import { formatTime } from "../utils/format";
import Avatar from "./Avatar";
import { EditIcon, ReplyIcon, SmileIcon, TrashIcon } from "./Icons";

export const EMOJIS = ["👍", "❤️", "😂", "🎉", "👀"];

// Highlight @mentions of the current user.
function renderBody(body, myName) {
  const mention = `@${myName}`;
  if (!body.toLowerCase().includes(mention.toLowerCase())) return body;
  const parts = body.split(new RegExp(`(@${myName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "i"));
  return parts.map((part, i) =>
    part.toLowerCase() === mention.toLowerCase() ? (
      <span key={i} className="mention">
        {part}
      </span>
    ) : (
      part
    )
  );
}

function Message({ message, author, me, users, compact, parent, onReply }) {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.body);
  const [picker, setPicker] = useState(false);

  const mine = message.authorId === me.id;
  const mentionsMe = message.body.toLowerCase().includes(`@${me.name.toLowerCase()}`);

  function saveEdit() {
    if (draft.trim() && draft.trim() !== message.body) {
      dispatch(messageEdited({ id: message.id, body: draft }));
    }
    setEditing(false);
  }

  function react(emoji) {
    dispatch(reactionToggled({ messageId: message.id, emoji, userId: me.id }));
    setPicker(false);
  }

  function remove() {
    if (window.confirm("Delete this message?")) dispatch(messageDeleted(message.id));
  }

  return (
    <li
      className={`message ${compact ? "compact" : ""} ${mentionsMe ? "mentioned" : ""}`}
      data-testid="message"
      tabIndex={-1} /* lets a tap focus the message on touch screens, revealing its actions */
    >
      {message.replyToId && (
        <div className="reply-ref">
          {parent ? (
            <>
              <strong>@{users[parent.authorId]?.name ?? "Unknown"}</strong> <span>{parent.body}</span>
            </>
          ) : (
            <em>Original message was deleted</em>
          )}
        </div>
      )}

      <div className="message-row">
        <div className="message-gutter">
          {compact ? <span className="hover-time">{formatTime(message.createdAt)}</span> : <Avatar user={author} />}
        </div>

        <div className="message-content">
          {!compact && (
            <div className="message-head">
              <span className="author" style={{ color: author.color }}>
                {author.name}
              </span>
              <time dateTime={new Date(message.createdAt).toISOString()}>{formatTime(message.createdAt)}</time>
            </div>
          )}

          {editing ? (
            <div className="edit-box">
              <textarea
                value={draft}
                autoFocus
                aria-label="Edit message"
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    saveEdit();
                  }
                  if (e.key === "Escape") setEditing(false);
                }}
              />
              <p className="hint">
                Enter to <button className="link-btn" onClick={saveEdit}>save</button> · Escape to{" "}
                <button className="link-btn" onClick={() => setEditing(false)}>cancel</button>
              </p>
            </div>
          ) : (
            <p className="message-body">
              {renderBody(message.body, me.name)}
              {message.editedAt && <span className="edited"> (edited)</span>}
            </p>
          )}

          {Object.keys(message.reactions).length > 0 && (
            <ul className="reactions">
              {Object.entries(message.reactions).map(([emoji, userIds]) => (
                <li key={emoji}>
                  <button
                    className={`reaction ${userIds.includes(me.id) ? "mine" : ""}`}
                    title={userIds.map((id) => users[id]?.name).join(", ")}
                    aria-label={`${emoji} ${userIds.length}, react`}
                    aria-pressed={userIds.includes(me.id)}
                    onClick={() => react(emoji)}
                  >
                    {emoji} <span>{userIds.length}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {!editing && (
        <div className={`message-actions ${picker ? "open" : ""}`}>
          {picker && (
            <div className="emoji-picker" role="group" aria-label="Pick a reaction">
              {EMOJIS.map((emoji) => (
                <button key={emoji} aria-label={`React with ${emoji}`} onClick={() => react(emoji)}>
                  {emoji}
                </button>
              ))}
            </div>
          )}
          <button className="icon-btn" aria-label="Add reaction" title="Add reaction" onClick={() => setPicker((p) => !p)}>
            <SmileIcon size={18} />
          </button>
          <button className="icon-btn" aria-label="Reply" title="Reply" onClick={() => onReply(message)}>
            <ReplyIcon size={18} />
          </button>
          {mine && (
            <>
              <button
                className="icon-btn"
                aria-label="Edit message"
                title="Edit"
                onClick={() => {
                  setDraft(message.body);
                  setEditing(true);
                }}
              >
                <EditIcon size={18} />
              </button>
              <button className="icon-btn danger" aria-label="Delete message" title="Delete" onClick={remove}>
                <TrashIcon size={18} />
              </button>
            </>
          )}
        </div>
      )}
    </li>
  );
}

export default Message;
