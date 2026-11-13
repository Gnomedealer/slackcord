import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "./Icons";

// A small dialog with one text field, used for "Create server" and
// "Create channel". `validate` returns an error message or "".
function Modal({ title, label, placeholder, submitLabel, hint, validate, onSubmit, onClose, transform }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSubmit(event) {
    event.preventDefault();
    const problem = validate(value);
    if (problem) return setError(problem);
    onSubmit(value);
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" role="dialog" aria-modal="true" aria-label={title} onSubmit={handleSubmit}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <label className="field">
          <span>{label}</span>
          <input
            ref={inputRef}
            value={value}
            placeholder={placeholder}
            maxLength={40}
            onChange={(e) => {
              setValue(transform ? transform(e.target.value) : e.target.value);
              setError("");
            }}
          />
        </label>
        {hint && !error && <p className="hint">{hint}</p>}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Modal;
