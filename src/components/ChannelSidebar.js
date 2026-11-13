import { useDispatch, useSelector } from "react-redux";
import { channelDeleted, serverDeleted } from "../features/chatSlice";
import { channelSelected, loggedOut } from "../features/sessionSlice";
import { selectActiveChannel, selectActiveServer, selectCurrentUser, selectServerChannels } from "../features/selectors";
import Avatar from "./Avatar";
import { HashIcon, LogoutIcon, PlusIcon, TrashIcon } from "./Icons";

function ChannelSidebar({ onCreateChannel, onNavigate }) {
  const dispatch = useDispatch();
  const server = useSelector(selectActiveServer);
  const channels = useSelector(selectServerChannels);
  const activeChannel = useSelector(selectActiveChannel);
  const me = useSelector(selectCurrentUser);

  const isOwner = server && server.ownerId === me.id;

  function deleteServer() {
    if (window.confirm(`Delete the server "${server.name}" and all of its messages? This can't be undone.`)) {
      dispatch(serverDeleted(server.id));
    }
  }

  function deleteChannel(channel) {
    if (window.confirm(`Delete #${channel.name} and all of its messages?`)) {
      dispatch(channelDeleted(channel.id));
    }
  }

  return (
    <aside className="channel-sidebar">
      <header className="sidebar-head">
        <h2 title={server?.name}>{server ? server.name : "No servers"}</h2>
        {isOwner && (
          <button className="icon-btn subtle" aria-label={`Delete server ${server.name}`} title="Delete server" onClick={deleteServer}>
            <TrashIcon size={16} />
          </button>
        )}
      </header>

      <div className="channel-section">
        {server && (
          <>
            <div className="section-label">
              <span>Text channels</span>
              <button className="icon-btn subtle" aria-label="Create channel" title="Create channel" onClick={onCreateChannel}>
                <PlusIcon size={16} />
              </button>
            </div>
            <ul className="channel-list">
              {channels.map((channel) => (
                <li key={channel.id} className={activeChannel?.id === channel.id ? "active" : ""}>
                  <button
                    className="channel-link"
                    aria-current={activeChannel?.id === channel.id}
                    onClick={() => {
                      dispatch(channelSelected({ serverId: server.id, channelId: channel.id }));
                      onNavigate?.();
                    }}
                  >
                    <HashIcon size={18} />
                    <span>{channel.name}</span>
                  </button>
                  {isOwner && channels.length > 1 && (
                    <button
                      className="icon-btn subtle channel-delete"
                      aria-label={`Delete channel ${channel.name}`}
                      onClick={() => deleteChannel(channel)}
                    >
                      <TrashIcon size={14} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <footer className="user-panel">
        <Avatar user={me} size={32} />
        <div className="user-panel-name">
          <strong>{me.name}</strong>
          <span>Online</span>
        </div>
        <button className="icon-btn subtle" aria-label="Log out" title="Log out" onClick={() => dispatch(loggedOut())}>
          <LogoutIcon size={18} />
        </button>
      </footer>
    </aside>
  );
}

export default ChannelSidebar;
