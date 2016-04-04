Okdice Roadmap
---

Current Feature Shortlist
---

* Save Chat History
* Review and Save Notes in page
* Alt Switcher
* Keyboard Shortcuts
* Highlight Your Turn & Flags & Game Start


Structure
---

okdice = {
  ui:ui,
  players: players,
  events: events,
  options: options
}


- Move contentscript function to okdice.js and trash the other file
- move jquery, underscore out of project root
- Use Bacon to watch the game state
  - Game Start / End
  - Round Start / End
  - Player Turn Start / End
    - isActivePlayer
