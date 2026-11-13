import { useEffect, useRef, useState } from "react";
import { CloseIcon, SendIcon } from "./Icons";

const MAX_LENGTH = 2000;

function Composer({ channelName, replyTo, replyAuthor, onCancelReply, onSend }) {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  // Focus the box when you start a reply or switch channels.
  useEffect(() => {
    inputRef.current?.focus();
  }, [replyTo, channelName]);

  // Grow the textarea with its content (up to a limit set in CSS).
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  function send() {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  }

  return (
    <div className="composer-wrap">
      {replyTo && (
        <div className="replying-bar">
          <span>
            Replying to <strong>{replyAuthor}</strong>
          </span>
          <button className="icon-btn subtle" aria-label="Cancel reply" onClick={onCancelReply}>
            <CloseIcon size={16} />
          </button>
        </div>
      )}
      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <textarea
          ref={inputRef}
          rows={1}
          value={text}
          maxLength={MAX_LENGTH}
          placeholder={`Message #${channelName}`}
          aria-label={`Message #${channelName}`}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
            if (e.key === "Escape" && replyTo) onCancelReply();
          }}
        />
        <button type="submit" className="send-btn" aria-label="Send message" disabled={!text.trim()}>
          <SendIcon size={18} />
        </button>
      </form>
      {text.length > MAX_LENGTH - 200 && (
        <p className="char-count">
          {text.length} / {MAX_LENGTH}
        </p>
      )}
    </div>
  );
}

export default Composer;
