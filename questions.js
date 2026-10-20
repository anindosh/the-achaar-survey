// Edit the survey here. Each question becomes one screen and one column in your Google Sheet.
//
//   id        unique key (don't change it after people start answering)
//   column    the column header in the Google Sheet
//   type      "text" | "longtext" | "email" | "single" | "multi" | "chips" | "spice"
//   required  true to make it mandatory (default false → shows a "skip" link)
//   options   for single / multi / chips: [label, emoji?] pairs
//   reaction  little pop-up shown after answering (optional)
window.SURVEY_QUESTIONS = [
  {
    id: "name",
    column: "Name",
    type: "text",
    title: "First things first, what do we call you?",
    placeholder: "Your name",
    required: true,
    reaction: "Namaste!"
  },
  {
    id: "frequency",
    column: "How often they eat achaar",
    type: "single",
    title: "How often does achaar make it to your plate?",
    options: [
      ["Every single meal", "🍛"],
      ["Most days", "🥄"],
      ["A few times a week", "🗓️"],
      ["Only when Nani visits", "👵"]
    ],
    required: true,
    reaction: "Respect."
  },
  {
    id: "favourites",
    column: "Favourite achaars",
    type: "chips",
    title: "Your ride-or-die achaars?",
    hint: "Pick as many as you like.",
    options: [
      ["Aam (Mango)", "🥭"],
      ["Nimbu (Lemon)", "🍋"],
      ["Hari mirch", "🌶️"],
      ["Lehsun (Garlic)", "🧄"],
      ["Gajar (Carrot)", "🥕"],
      ["Mixed", "🫙"],
      ["Gongura", "🌿"],
      ["Kathal (Jackfruit)", "🍈"],
      ["Something else", "✨"]
    ],
    required: true,
    reaction: "Good taste!"
  },
  {
    id: "spice",
    column: "Spice level (1-5)",
    type: "spice",
    title: "How much heat can you handle?",
    labels: ["Mild & sweet", "A little kick", "Proper spicy", "Mouth on fire", "Garam masala in human form"],
    faces: ["😊", "🙂", "😅", "🥵", "🔥"],
    required: true
  },
  {
    id: "source",
    column: "Where they get achaar",
    type: "single",
    title: "Where does your achaar usually come from?",
    options: [
      ["Made at home by family", "🏡"],
      ["I make it myself", "👩‍🍳"],
      ["Local shop or market", "🛒"],
      ["Big brands", "🏷️"],
      ["Online", "📦"]
    ],
    required: true
  },
  {
    id: "matters",
    column: "What matters most",
    type: "multi",
    title: "What matters most in a jar of achaar?",
    hint: "Pick up to three.",
    max: 3,
    options: [
      ["Tastes like home", "🏠"],
      ["Less oil", "💧"],
      ["No preservatives", "🌱"],
      ["Regional recipes", "🗺️"],
      ["Pretty packaging", "🎀"],
      ["Price", "💸"]
    ],
    required: true,
    reaction: "Noted!"
  },
  {
    id: "price",
    column: "Would pay for 250g",
    type: "single",
    title: "What would you happily pay for a 250g jar?",
    options: [
      ["Under ₹150"],
      ["₹150 – ₹250"],
      ["₹250 – ₹400"],
      ["₹400+ if it’s really good"]
    ],
    required: true
  },
  {
    id: "story",
    column: "Achaar story",
    type: "longtext",
    title: "Tell us about the achaar you can’t stop thinking about.",
    hint: "Whose was it? What made it special?",
    placeholder: "My Nani’s mango achaar…"
  },
  {
    id: "email",
    column: "Email",
    type: "email",
    title: "Want a taste when it’s ready?",
    hint: "Leave your email and we’ll tell you first. No spam, promise.",
    placeholder: "you@example.com"
  }
];
