import { initials } from "../utils/format";

function Avatar({ user, size = 40 }) {
  return (
    <span
      className="avatar"
      style={{ background: user.color, width: size, height: size, fontSize: size * 0.4 }}
      aria-hidden="true"
    >
      {initials(user.name)}
    </span>
  );
}

export default Avatar;
