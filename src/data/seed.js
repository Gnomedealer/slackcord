import { colorFor } from "../utils/format";

// Demo community so the app has something to explore on first visit.
// Timestamps are relative to `now` so the chat always looks recent.

const people = ["Tommy", "Ava", "Marcus", "Priya", "Leo", "Sofia", "Jordan"];

export function createSeed(now = Date.now()) {
  const minutes = (m) => now - m * 60000;

  const users = {};
  people.forEach((name) => {
    const id = `u_${name.toLowerCase()}`;
    users[id] = { id, name, color: colorFor(name) };
  });
  const everyone = Object.keys(users);

  const servers = {
    s_hq: {
      id: "s_hq",
      name: "Slackcord HQ",
      ownerId: "u_tommy",
      memberIds: everyone,
      channelIds: ["c_welcome", "c_general", "c_random"],
    },
    s_code: {
      id: "s_code",
      name: "Code Crew",
      ownerId: "u_priya",
      memberIds: ["u_tommy", "u_priya", "u_marcus", "u_leo", "u_jordan"],
      channelIds: ["c_help", "c_showcase", "c_resources"],
    },
    s_weekend: {
      id: "s_weekend",
      name: "Weekend Plans",
      ownerId: "u_ava",
      memberIds: ["u_tommy", "u_ava", "u_sofia", "u_leo"],
      channelIds: ["c_plans"],
    },
  };

  const channels = {
    c_welcome: { id: "c_welcome", serverId: "s_hq", name: "welcome", topic: "Say hi and introduce yourself" },
    c_general: { id: "c_general", serverId: "s_hq", name: "general", topic: "Anything goes" },
    c_random: { id: "c_random", serverId: "s_hq", name: "random", topic: "Memes, links, and off-topic chat" },
    c_help: { id: "c_help", serverId: "s_code", name: "help", topic: "Stuck? Ask here — no question is too small" },
    c_showcase: { id: "c_showcase", serverId: "s_code", name: "show-and-tell", topic: "Share what you're building" },
    c_resources: { id: "c_resources", serverId: "s_code", name: "resources", topic: "Docs, tutorials, and tools" },
    c_plans: { id: "c_plans", serverId: "s_weekend", name: "general", topic: "Where are we going this weekend?" },
  };

  const raw = [
    ["c_welcome", "u_tommy", 2900, "Welcome to Slackcord! 👋 Pick a channel on the left and jump in."],
    ["c_welcome", "u_ava", 2880, "Hi everyone! Excited to be here."],
    ["c_welcome", "u_marcus", 2860, "Hey hey. Marcus here — backend dev, coffee enthusiast."],
    ["c_welcome", "u_priya", 2700, "Hi all! I run the Code Crew server, come say hi if you're learning to code."],
    ["c_general", "u_sofia", 1500, "Did anyone catch the meteor shower last night?"],
    ["c_general", "u_leo", 1490, "Clouds ruined it for me 😩"],
    ["c_general", "u_sofia", 1489, "Same here. Maybe next time."],
    ["c_general", "u_jordan", 300, "Reminder: team trivia night is Friday at 7!"],
    ["c_general", "u_ava", 295, "I'm in. Last time we lost on a question about octopus hearts."],
    ["c_general", "u_marcus", 290, "Three hearts. I will never forget that."],
    ["c_general", "u_tommy", 45, "Count me in for trivia 🎉"],
    ["c_random", "u_leo", 900, "Hot take: tabs are better than spaces."],
    ["c_random", "u_marcus", 898, "Respectfully, no."],
    ["c_random", "u_jordan", 897, "Let the prettier config decide."],
    ["c_help", "u_jordan", 1200, "Why does my React state not update right after I call setState?"],
    ["c_help", "u_priya", 1195, "State updates are scheduled — the new value shows up on the next render. If you need the latest value, use the updater form: setCount(c => c + 1)."],
    ["c_help", "u_jordan", 1190, "Ohh that makes sense. Thank you!"],
    ["c_showcase", "u_tommy", 600, "Just finished rebuilding my budget tracker in React — categories, monthly budgets, CSV export."],
    ["c_showcase", "u_priya", 590, "Nice! Did you store money as cents?"],
    ["c_showcase", "u_tommy", 588, "Yep, integers all the way. No more 0.1 + 0.2 bugs."],
    ["c_resources", "u_marcus", 2000, "MDN is still the best reference for anything HTML, CSS, or JavaScript."],
    ["c_resources", "u_priya", 1980, "And the official react.dev docs are great now — the interactive examples help a lot."],
    ["c_plans", "u_ava", 400, "Hiking Saturday morning? The weather looks perfect."],
    ["c_plans", "u_sofia", 380, "Yes! I'll bring snacks."],
    ["c_plans", "u_leo", 370, "I can drive. Meet at 8?"],
  ];

  const messages = {};
  raw.forEach(([channelId, authorId, minsAgo, body], i) => {
    const id = `m_seed_${i}`;
    messages[id] = { id, channelId, authorId, body, createdAt: minutes(minsAgo), reactions: {} };
  });

  // A couple of reactions and a reply to show those features off.
  messages.m_seed_10.reactions = { "🎉": ["u_ava", "u_jordan"], "👍": ["u_marcus"] };
  messages.m_seed_15.reactions = { "❤️": ["u_jordan"], "👍": ["u_leo", "u_tommy"] };
  messages.m_seed_19.replyToId = "m_seed_18";

  return {
    users,
    servers,
    channels,
    messages,
    serverOrder: ["s_hq", "s_code", "s_weekend"],
  };
}
