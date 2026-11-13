import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import ChannelSidebar from "./components/ChannelSidebar";
import ChatArea from "./components/ChatArea";
import Login from "./components/Login";
import MemberList from "./components/MemberList";
import Modal from "./components/Modal";
import ServerRail from "./components/ServerRail";
import { channelCreated, serverCreated } from "./features/chatSlice";
import { selectActiveServer, selectCurrentUser } from "./features/selectors";
import { toChannelName } from "./utils/format";

function App() {
  const dispatch = useDispatch();
  const me = useSelector(selectCurrentUser);
  const server = useSelector(selectActiveServer);
  const channels = useSelector((state) => state.chat.channels);

  const [modal, setModal] = useState(null); // "server" | "channel" | null
  const [menuOpen, setMenuOpen] = useState(false); // mobile drawer
  const [showMembers, setShowMembers] = useState(() => window.innerWidth >= 1100);

  if (!me) return <Login />;

  const channelNameTaken = (name) =>
    server.channelIds.some((id) => channels[id]?.name === name);

  return (
    <div className={`app ${menuOpen ? "menu-open" : ""} ${showMembers ? "members-open" : ""}`}>
      <div className="nav-drawer">
        <ServerRail onCreateServer={() => setModal("server")} />
        <ChannelSidebar onCreateChannel={() => setModal("channel")} onNavigate={() => setMenuOpen(false)} />
      </div>
      {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} aria-hidden="true" />}

      <ChatArea
        onOpenMenu={() => setMenuOpen(true)}
        showMembers={showMembers}
        onToggleMembers={() => setShowMembers((s) => !s)}
      />
      {showMembers && <MemberList />}

      {modal === "server" && (
        <Modal
          title="Create a server"
          label="Server name"
          placeholder={`${me.name}'s server`}
          submitLabel="Create"
          hint="It starts with a #general channel. You can add more later."
          validate={(v) => (v.trim().length < 2 ? "Server name must be at least 2 characters." : "")}
          onSubmit={(name) => {
            dispatch(serverCreated({ name, ownerId: me.id }));
            setModal(null);
            setMenuOpen(false);
          }}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "channel" && server && (
        <Modal
          title={`Create a channel in ${server.name}`}
          label="Channel name"
          placeholder="new-channel"
          submitLabel="Create channel"
          hint="Lowercase letters, numbers, and dashes."
          transform={(v) => v.toLowerCase().replace(/\s/g, "-")}
          validate={(v) => {
            const name = toChannelName(v);
            if (name.length < 2) return "Channel name must be at least 2 characters.";
            if (channelNameTaken(name)) return `#${name} already exists in this server.`;
            return "";
          }}
          onSubmit={(name) => {
            dispatch(channelCreated({ serverId: server.id, name }));
            setModal(null);
            setMenuOpen(false);
          }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

export default App;
