okdice
---

okdice is a platform for client side enhancements to the kDice strategy game hosted at http://kdice.com

Features
---

These are the currently implemented features:

* Chat Buttons
  * Configurable buttons that "say" common phrases like gg, gt, thank you, etc
  * Choose your own phrases on the options page
* Links are *clickable* in chat
  * The links open in a new tab
  * Long urls are truncated to avoid breaking the chat box
* Table Selector
  * Change tables with a single click
  * Optionally, sit in to the new table immediately upon arriving at the table
* Flag Buttons
  * Buttons that looks like flags of the appropriate colors
  * Clicking it says "Flag [color]"
  * Flag is highlighted to remind you who you flagged
* Player Buttons
  * Flag and Mute a player with a click
  * Visible when you mouseover a player
* Configurable Theming
  * Optionally hide the header of the page to give more room for the board
  * Color the players info boxes
  * Embiggening of the chat text

These are the features that are ready for the next release:

* Local storage of user accounts
  * Switch accounts with the click of a button
* Chat History
  * Save and scroll through your chat history
* Chat Bubbles
  * have chat statements appear in bubbles over the speakers before fading out
* Keyboard shortcuts
  * Focus chat on keyboard shortcut (c?)
  * End turn
  * Flag (1,2,3... )
* Smaller activity log window
* Highlight flagged player
* Highlight your turn in tab
  * Favicon alert
  * Tab title changes

An Extensible Platform
--

The *okdice* object exposes an api to the UI elements and actions a user performs in the browser. This makes it easy to compose useful widgets and behaviors,


    okdice.say('I love brown shoes.');

    okdice.flag('brown');

    okdice.endTurn();

    okdice.sitIn('tablename');


A few more complicated widgets and features have been built, such as:

* Chat Buttons that speak common phrases at the click of a button
* Flag buttons that state your flag by clicking on the appropriate color



Coming Soon
--
* Local storage of user accounts
** Change alts with a click
* Chat History
* Keyboard shortcuts
  * Focus chat on keyboard shortcut (c?)
  * End turn
  * Flag (1,2,3... )
* Smaller activity log window
* Highlight flagged player
* Highlight your turn in tab
  * Favicon alert
  * Tab title changes

