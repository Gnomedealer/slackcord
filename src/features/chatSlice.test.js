import reducer, { channelCreated, channelDeleted, serverCreated, serverDeleted, userCreated } from "./chatSlice";
import { createSeed } from "../data/seed";
import { toChannelName } from "../utils/format";

test("channel names are normalized", () => {
  expect(toChannelName("  My Cool Channel!! ")).toBe("my-cool-channel");
  expect(toChannelName("a  --  b")).toBe("a-b");
});

test("new users join every server", () => {
  const state = reducer(createSeed(), userCreated("Taylor"));
  const user = Object.values(state.users).find((u) => u.name === "Taylor");
  Object.values(state.servers).forEach((server) => expect(server.memberIds).toContain(user.id));
});

test("creating a server gives it a #general channel", () => {
  const state = reducer(createSeed(), serverCreated({ name: "New One", ownerId: "u_tommy" }));
  const server = Object.values(state.servers).find((s) => s.name === "New One");
  expect(state.channels[server.channelIds[0]].name).toBe("general");
  expect(state.serverOrder).toContain(server.id);
});

test("deleting a server removes its channels and messages", () => {
  const state = reducer(createSeed(), serverDeleted("s_code"));
  expect(state.servers.s_code).toBeUndefined();
  expect(state.channels.c_help).toBeUndefined();
  expect(Object.values(state.messages).some((m) => m.channelId === "c_help")).toBe(false);
  expect(state.serverOrder).not.toContain("s_code");
});

test("a server's last channel can't be deleted", () => {
  const state = reducer(createSeed(), channelDeleted("c_plans"));
  expect(state.channels.c_plans).toBeDefined();
});

test("deleting a channel removes its messages", () => {
  let state = reducer(createSeed(), channelCreated({ serverId: "s_hq", name: "temp" }));
  state = reducer(state, channelDeleted("c_random"));
  expect(state.channels.c_random).toBeUndefined();
  expect(state.servers.s_hq.channelIds).not.toContain("c_random");
  expect(Object.values(state.messages).some((m) => m.channelId === "c_random")).toBe(false);
});
