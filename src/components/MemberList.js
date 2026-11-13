import { useSelector } from "react-redux";
import { selectActiveServer, selectCurrentUser, selectUsers } from "../features/selectors";
import Avatar from "./Avatar";
import { CrownIcon } from "./Icons";

function MemberList() {
  const server = useSelector(selectActiveServer);
  const users = useSelector(selectUsers);
  const me = useSelector(selectCurrentUser);
  if (!server) return null;

  const members = server.memberIds
    .map((id) => users[id])
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <aside className="member-list" aria-label="Members">
      <h3 className="section-label">Members — {members.length}</h3>
      <ul>
        {members.map((user) => (
          <li key={user.id} className="member">
            <Avatar user={user} size={32} />
            <span className="member-name">
              {user.name}
              {user.id === me.id && <span className="muted"> (you)</span>}
            </span>
            {user.id === server.ownerId && (
              <span className="owner" title="Server owner" aria-label="Server owner">
                <CrownIcon size={14} />
              </span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default MemberList;
