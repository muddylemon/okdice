okdice
---

okdice is a platform for client side enhancements to the kDice strategy game hosted at http://kdice.com


How it works
--

The *okdice* object exposes an api to the UI elements and actions a user performs in the browser


    okdice.say('I love brown shoes.');

    okdice.flag('brown');

    okdice.endTurn();

    okdice.sitIn('tablename');


A few more complicated widgets and features have been built, such as:

* Chat Buttons that speak common phrases at the click of a button
* Flag buttons that state your flag by clicking on the appropriate color


Testing The Alpha Version
--

If you're feeling adventurous, clone the repo and drop the app directory onto your chrome://extensions page. You will need to have developer mode enabled.

Visit kdice and you should see the rudimentary features working.

Current Working Bits
--

* Chat Buttons
  * Buttons that "say" common phrases like gg, gt, thank you, etc
* Flag Buttons
  * Buttons that looks like flags of the appropriate colors
  * Clicking says "Flag [color]"
  * Flag is highlighted to remind you
* Player Buttons
  * Flag and Mute buttons
  * Visible when you mouseover a player
* Theming
  * Hide header
  * Background color of players
  * Embiggening of the chat text


Coming Soon
--
* Local storage of user accounts
** Change alts with a click
* Sit In to a table with one click
  * Click table name in table selector and go to the table (no pressing Go button)
  * Option to sit in automatically on arrival
* Chat History
* Keyboard shortcuts
  * Focus chat on keyboard shortcut (c?)
  * End turn
  * Flag (1,2,3... )
* Smaller activity log window
* Highlight flagged player
  * Clear at end game event
* Extension options page
* Highlight your turn in tab
  * Favicon alert
  * Tab title changes

