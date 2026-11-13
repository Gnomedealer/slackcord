import { useDispatch, useSelector } from "react-redux";
import { serverSelected } from "../features/sessionSlice";
import { selectActiveServer, selectServers } from "../features/selectors";
import { initials } from "../utils/format";
import { PlusIcon } from "./Icons";

function ServerRail({ onCreateServer, onNavigate }) {
  const dispatch = useDispatch();
  const servers = useSelector(selectServers);
  const active = useSelector(selectActiveServer);

  return (
    <nav className="server-rail" aria-label="Servers">
      <ul>
        {servers.map((server) => (
          <li key={server.id} className={active?.id === server.id ? "active" : ""}>
            <button
              className="server-icon"
              title={server.name}
              aria-label={server.name}
              aria-current={active?.id === server.id}
              onClick={() => {
                dispatch(serverSelected(server.id));
                onNavigate?.();
              }}
            >
              {initials(server.name)}
            </button>
          </li>
        ))}
        <li>
          <button className="server-icon add" title="Create a server" aria-label="Create a server" onClick={onCreateServer}>
            <PlusIcon />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default ServerRail;
