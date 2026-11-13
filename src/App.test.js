import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import App from "./App";
import { makeStore } from "./app/store";

beforeEach(() => {
  window.localStorage.clear();
  Element.prototype.scrollIntoView = jest.fn();
});

function renderApp(store = makeStore()) {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  return store;
}

function joinAs(name) {
  userEvent.type(screen.getByLabelText(/pick a display name/i), name);
  userEvent.click(screen.getByRole("button", { name: /join slackcord/i }));
}

function sendMessage(text) {
  const box = screen.getByRole("textbox", { name: /^message #/i });
  userEvent.type(box, `${text}{enter}`);
}

test("shows the login screen first", () => {
  renderApp();
  expect(screen.getByRole("heading", { name: "Slackcord" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /tommy/i })).toBeInTheDocument();
});

test("rejects a display name that's already taken", () => {
  renderApp();
  joinAs("ava");
  expect(screen.getByRole("alert")).toHaveTextContent(/taken/i);
});

test("joining opens the first server's first channel", () => {
  renderApp();
  joinAs("Taylor");
  expect(screen.getByRole("heading", { name: "welcome" })).toBeInTheDocument();
  expect(screen.getByText(/welcome to slackcord!/i)).toBeInTheDocument();
});

test("sending a message adds it to the channel", () => {
  renderApp();
  joinAs("Taylor");
  sendMessage("Hello from the tests!");
  expect(screen.getByText("Hello from the tests!")).toBeInTheDocument();
});

test("switching channels shows that channel's messages", () => {
  renderApp();
  joinAs("Taylor");
  userEvent.click(screen.getByRole("button", { name: "random" }));
  expect(screen.getByRole("heading", { name: "random" })).toBeInTheDocument();
  expect(screen.getByText(/tabs are better than spaces/i)).toBeInTheDocument();
});

test("creating a channel switches to it", () => {
  renderApp();
  joinAs("Taylor");
  userEvent.click(screen.getByRole("button", { name: "Create channel" }));
  const dialog = screen.getByRole("dialog");
  userEvent.type(within(dialog).getByLabelText(/channel name/i), "Book Club");
  userEvent.click(within(dialog).getByRole("button", { name: "Create channel" }));
  expect(screen.getByRole("heading", { name: "book-club" })).toBeInTheDocument();
});

test("creating a server makes you the owner with a #general channel", () => {
  renderApp();
  joinAs("Taylor");
  userEvent.click(screen.getByRole("button", { name: "Create a server" }));
  const dialog = screen.getByRole("dialog");
  userEvent.type(within(dialog).getByLabelText(/server name/i), "Taylor's Place");
  userEvent.click(within(dialog).getByRole("button", { name: "Create" }));
  expect(screen.getByRole("heading", { name: "Taylor's Place" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "general" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /delete server/i })).toBeInTheDocument();
});

test("reacting to a message toggles the count", () => {
  renderApp();
  joinAs("Taylor");
  sendMessage("React to me");
  const message = screen.getByText("React to me").closest("li");
  userEvent.click(within(message).getByRole("button", { name: "Add reaction" }));
  userEvent.click(within(message).getByRole("button", { name: "React with 🎉" }));
  const chip = within(message).getByRole("button", { name: /🎉 1/ });
  expect(chip).toHaveAttribute("aria-pressed", "true");
  userEvent.click(chip);
  expect(within(message).queryByRole("button", { name: /🎉 1/ })).not.toBeInTheDocument();
});

test("you can edit and delete your own messages", () => {
  jest.spyOn(window, "confirm").mockReturnValue(true);
  renderApp();
  joinAs("Taylor");
  sendMessage("Typo mesage");
  let message = screen.getByText("Typo mesage").closest("li");

  userEvent.click(within(message).getByRole("button", { name: "Edit message" }));
  const editor = within(message).getByRole("textbox", { name: "Edit message" });
  userEvent.clear(editor);
  userEvent.type(editor, "Fixed message{enter}");
  expect(screen.getByText("Fixed message")).toBeInTheDocument();
  expect(screen.getByText("(edited)")).toBeInTheDocument();

  message = screen.getByText("Fixed message").closest("li");
  userEvent.click(within(message).getByRole("button", { name: "Delete message" }));
  expect(screen.queryByText("Fixed message")).not.toBeInTheDocument();
  window.confirm.mockRestore();
});

test("replying shows the original message above yours", () => {
  renderApp();
  joinAs("Taylor");
  const original = screen.getByText(/excited to be here/i).closest("li");
  userEvent.click(within(original).getByRole("button", { name: "Reply" }));
  expect(screen.getByText(/replying to/i)).toHaveTextContent("Ava");
  sendMessage("Welcome Ava!");
  const reply = screen.getByText("Welcome Ava!").closest("li");
  expect(within(reply).getByText(/excited to be here/i)).toBeInTheDocument();
});

test("search filters messages in the channel", () => {
  renderApp();
  joinAs("Taylor");
  userEvent.click(screen.getByRole("button", { name: "general" }));
  userEvent.click(screen.getAllByRole("button", { name: "Search messages" })[0]);
  userEvent.type(screen.getByRole("searchbox", { name: "Search messages" }), "trivia");
  expect(screen.getByText(/2 results for/i)).toBeInTheDocument();
  expect(screen.queryByText(/meteor shower/i)).not.toBeInTheDocument();
});

test("messages persist after a reload", async () => {
  jest.useFakeTimers();
  const store = renderApp();
  joinAs("Taylor");
  sendMessage("Still here after reload");
  jest.runAllTimers(); // flush the batched save
  jest.useRealTimers();

  const saved = JSON.parse(window.localStorage.getItem("slackcord.v1"));
  expect(Object.values(saved.chat.messages).some((m) => m.body === "Still here after reload")).toBe(true);
  expect(saved.session.currentUserId).toBe(store.getState().session.currentUserId);
});
