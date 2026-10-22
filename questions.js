// Edit the survey here. Each question becomes one screen and one column in your Google Sheet.
//
//   id        unique key (don't change it after people start answering)
//   column    the column header in the Google Sheet
//   type      "fields" | "longtext" | "single" | "multi" | "chips" | "pictures" | "spice"
//             ("fields" puts several underlined inputs on one screen, each with its own column)
//   required  true to make it mandatory (the next arrow stays dark until it's answered)
//   missing   for a "fields" entry: the message shown under it when it is left empty
//             a "fields" entry can also be type "checkbox" (saved as Yes / No), "tel", or "choice"
//             (a row of pills from its `options`), and
//             showIf: "<checkbox id>" only shows it while that box is ticked
//   options   for single / multi / chips: [label, emoji?] pairs, or { label, image } for a small photo in the box
//             for pictures: { label, image, width } — width is the image's width in mockup px
//             (four pictures make a 2 × 2 grid where every photo is the same height instead)
//   max       for multi / pictures: how many can be picked (pictures become multi-select)
//   multi     for pictures: true lets people pick any number
//   layout    "tiles" shows single / multi options as the big quiz-style tile grid (automatic past 6 options);
//             "stack" keeps them in one column however many there are
//   autoAdvance for multi with max: move on as soon as `max` answers are picked
//   exclusive for multi: options that can't be combined with others (picking one clears the rest)
//   other     the option label (e.g. "Other") that reveals a text field; saved as "Other: <their words>"
//             (otherPlaceholder / otherMissing set the field's placeholder and empty-field message)
//   showIf    { question: "<id>", equals: "<answer>" } — only ask this when that earlier answer was picked
//   reaction  little pop-up shown after answering (optional)
window.SURVEY_QUESTIONS = [
  {
    id: "frequency",
    column: "How often they eat achaar",
    type: "single",
    title: "How often do you eat achaar?",
    options: [
      ["Almost everyday"],
      ["Few times a week"],
      ["Weekly"],
      ["Only when my food tastes meh"],
      ["On special occasions"],
      ["Never :("]
    ],
    required: true
  },
  {
    id: "trend",
    column: "Eats achaar vs a few years ago",
    type: "single",
    title: "Compared to a few years ago, do you eat achaar…",
    options: [
      ["More"],
      ["About the same"],
      ["Less"]
    ],
    required: true
  },
  {
    id: "why-less",
    column: "Why they eat less achaar",
    type: "multi",
    title: "Why?",
    hint: "Select any 2",
    max: 2,
    autoAdvance: true,
    showIf: { question: "trend", equals: "Less" },
    options: [
      ["Too much oil & salt"],
      ["I don’t live with family anymore"],
      ["Can’t find achaar I like"],
      ["I don’t want to eat more"]
    ],
    required: true
  },
  {
    id: "prefer",
    column: "Prefers",
    type: "pictures",
    title: "Which do you prefer?",
    options: [
      { label: "Pieces of the achaar", image: "assets/pieces.webp", width: 84 },
      { label: "Masala of the achaar", image: "assets/masala.webp", width: 170 },
      { label: "I need both", image: "assets/both.webp", width: 170 }
    ],
    required: true
  },
  {
    id: "where",
    column: "Where they ate achaar (last 6 months)",
    type: "multi",
    layout: "tiles",
    title: "In the last 6 months, where have you eaten achaar?",
    hint: "Select all that apply",
    options: [
      { label: "With home food", image: "assets/where-home-food.webp" },
      { label: "Packed lunchbox", image: "assets/where-packed-lunchbox.webp" },
      { label: "In cafeteria", image: "assets/where-cafeteria.webp" },
      { label: "In restaurants", image: "assets/where-restaurants.webp" },
      { label: "Trains, flights, road trips etc.", image: "assets/where-while-travelling.webp" },
      { label: "Living or travelling abroad", image: "assets/where-living-abroad.webp" }
    ],
    required: true
  },
  {
    id: "carried",
    column: "Taken achaar out of the house",
    type: "single",
    title: "Have you ever taken achaar with you out of the house?",
    options: [
      ["Yes"],
      ["No"]
    ],
    required: true
  },
  {
    id: "stops",
    column: "What stops them taking achaar to work",
    type: "pictures",
    title: "When you think of taking your favourite achaar to work, what stops you?",
    hint: "Select all that apply",
    multi: true,
    exclusive: ["I don’t really want to"],
    options: [
      { label: "It leaks I’m scared", image: "assets/leaks.webp" },
      { label: "I have to pack spoons etc. Too much effort.", image: "assets/jhanjhat.webp" },
      { label: "I don’t really want to", image: "assets/dont-want.webp" },
      { label: "Doesn’t fit in my bag", image: "assets/bag.webp" }
    ],
    required: true
  },
  {
    id: "annoys",
    column: "What annoys them most while eating achaar at home",
    type: "single",
    title: "What annoys you most while eating achaar at home?",
    other: "Other",
    otherPlaceholder: "What annoys you?",
    otherMissing: "Please tell us what annoys you :(",
    options: [
      ["Oil gets on the jar, lid and shelf"],
      ["It gets spoilt easily"],
      ["Nothing really bothers me"],
      ["Other"]
    ],
    required: true
  },
  {
    id: "source",
    column: "Where most of their achaar comes from",
    type: "single",
    layout: "stack",
    title: "Where does most of your achaar come from?",
    options: [
      ["Made at home"],
      ["Sent by family or friends"],
      ["From a local shop/home-seller"],
      ["From a supermarket"],
      ["Online"],
      ["Quick delivery apps (Blinkit, etc.)"]
    ],
    required: true
  },
  {
    id: "matters",
    column: "What matters when buying achaar",
    type: "multi",
    title: "What matters when you buy achaar?",
    hint: "Select any 2",
    max: 2,
    autoAdvance: true,
    options: [
      ["Taste"],
      ["Less oil"],
      ["No preservatives"],
      ["Convenient packaging"],
      ["Price"]
    ],
    required: true
  },
  {
    id: "about",
    type: "fields",
    title: "Help us put a name to your answers :)",
    fields: [
      { id: "name", column: "Name", type: "text", placeholder: "Your name*", required: true, missing: "Please tell us your name :(" },
      { id: "email", column: "Email", type: "email", placeholder: "Your email ID" },
      { id: "age", column: "Age group", type: "choice", label: "Your age*", options: ["18–25", "26–40", "40+"], required: true, missing: "Please pick your age group :(" },
      { id: "feedback", column: "Open to giving feedback", type: "checkbox", label: "We’re building something, and need your help. Would you be open to provide feedback on early versions?" },
      { id: "phone", column: "Phone", type: "tel", placeholder: "Your phone number", showIf: "feedback" }
    ]
  }
];
