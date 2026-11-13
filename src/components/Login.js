import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userCreated } from "../features/chatSlice";
import { loggedIn } from "../features/sessionSlice";
import { selectUsers } from "../features/selectors";
import Avatar from "./Avatar";

function Login() {
  const dispatch = useDispatch();
  const users = Object.values(useSelector(selectUsers));
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function join(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) return setError("Name must be at least 2 characters.");
    if (users.some((u) => u.name.toLowerCase() === trimmed.toLowerCase())) {
      return setError("That name is taken — pick it from the list below or choose another.");
    }
    dispatch(userCreated(trimmed));
  }

  return (
    <div className="login">
      <div className="login-card">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            S
          </span>
          <h1>Slackcord</h1>
        </div>
        <p className="muted">Chat with your communities in servers and channels.</p>

        <form onSubmit={join} className="login-form">
          <label className="field">
            <span>Pick a display name</span>
            <input
              value={name}
              maxLength={24}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="e.g. Taylor"
              autoFocus
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="btn btn-primary btn-block">
            Join Slackcord
          </button>
        </form>

        <div className="divider">
          <span>or continue as</span>
        </div>

        <ul className="user-picker">
          {users.map((user) => (
            <li key={user.id}>
              <button className="user-chip" onClick={() => dispatch(loggedIn(user.id))}>
                <Avatar user={user} size={28} />
                {user.name}
              </button>
            </li>
          ))}
        </ul>

        <p className="fine-print">This is a demo — there are no passwords, and everything is saved in this browser only.</p>
      </div>
    </div>
  );
}

export default Login;
