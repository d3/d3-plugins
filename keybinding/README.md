# keybinding

Keybindings for d3

Demo: <http://bl.ocks.org/4444952>

<a name="keybinding" href="#keybinding">#</a> d3.**keybinding**()

Returns a keybinding object that can be used with `.call` to provide
bindings on selections.

The keybinding object exposes `.on()` for common keycodes and dispatches events
with arguments `[d3.event, modifiers]` in which modifiers is a string which
can include `⇧`, `⌃`, `⌥`, `⌘'`.

Keystroke events on input areas (`<input>`, `<select>`, and `<textarea>`)
are not caught.
