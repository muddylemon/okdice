okdice
---

okdice is a platform for client side enhancements to the kDice strategy game hosted at http://kdice.com


How it works
--

The windows.okdice object exposes an api to the UI elements and actions a user performs in the browser


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


Initial Feature Wishlist
--

* Chat Buttons
* Flag Buttons
* Sit In to a table with one click
* Chat History
* Focus chat on keypress
* Keyboard shortcuts for ending turn, flagging
* Auto end turn button
* Theming
** Smaller activity log window
** Bigger chat log (sidebar)
* Mute buttons on player squares

