import { useHotkeys } from "react-hotkeys-hook"

/*
  Tiny wrapper around useHotkeys, so we can call preventDefault on every
  stroke. Otherwise, an unwanted keystroke might appear, e.g. if the 
  shortcut brings up a dialog with a form in it.

  Example: 'control+r'

  Modifier keys: shift, option/alt, ctrl/control, command

  Special keys: backspace, tab, clear, enter, return, esc, escape, space, up, down,
                left, right, home, end, pageup, pagedown, del, delete and f1 through f19.

  More docs:

  https://github.com/jaywcjlove/hotkeys/#supported-keys
*/
export default function (key, f) {
  useHotkeys(key, (event) => {
    event.preventDefault()
    f()
  })
}
