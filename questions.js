// Edit the survey here. Each question becomes one screen and one column in your Google Sheet.
//
//   id        unique key (don't change it after people start answering)
//   column    the column header in the Google Sheet
//   type      "fields" | "longtext" | "single" | "multi" | "chips" | "pictures" | "spice"
//             ("fields" puts several underlined inputs on one screen, each with its own column)
//   required  true to make it mandatory (the next arrow stays dark until it's answered)
//   missing   for a "fields" entry: the message shown under it when it is left empty
//   options   for single / multi / chips: [label, emoji?] pairs
//             for pictures: { label, image, width } — width is the image's width in mockup px
//             (four pictures make a 2 × 2 grid where every photo is the same height instead)
//   max       for multi / pictures: how many can be picked (pictures become multi-select)
//   layout    "tiles" shows single / multi options as the big quiz-style tile grid (automatic past 6 options);
//             "stack" keeps them in one column however many there are
//   exclusive for multi: options that can't be combined with others (picking one clears the rest)
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
    title: "In the last 6 months, where have you eaten achaar?",
    hint: "Select all that apply",
    options: [
      ["With home food"],
      ["Packed lunchbox"],
      ["In cafeteria"],
      ["In restaurants"],
      ["While travelling (trains, flights, road trips)"],
      ["Abroad (living or travelling outside India)"],
      ["Haven’t eaten it outside home"]
    ],
    exclusive: ["Haven’t eaten it outside home"],
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
    hint: "Select any 2",
    max: 2,
    options: [
      { label: "It leaks I’m scared", image: "assets/leaks.webp" },
      { label: "Too much jhanjhat to pack it", image: "assets/jhanjhat.webp" },
      { label: "Don’t want to", image: "assets/dont-want.webp" },
      { label: "Doesn’t fit in my bag", image: "assets/bag.webp" }
    ],
    required: true
  },
  {
    id: "annoys",
    column: "What annoys them about achaar at home",
    type: "multi",
    title: "What annoys you about achaar at home?",
    hint: "Select any 2",
    max: 2,
    exclusive: ["Nothing"],
    options: [
      ["Oily jar"],
      ["Sticky lid"],
      ["Goes bad easily"],
      ["Too big to finish"],
      ["Nothing"]
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
      ["Quick delivery apps (Blinkit, etc.)"],
      ["Mix of all"]
    ],
    required: true
  },
  {
    id: "matters",
    column: "What matters most when buying achaar",
    type: "multi",
    title: "What matters most when you buy achaar?",
    hint: "Select up to 3",
    max: 3,
    options: [
      ["Tastes like home"],
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
      { id: "email", column: "Email", type: "email", placeholder: "Your email ID*", required: true, missing: "Please tell us your email ID :(" }
    ]
  }
];
