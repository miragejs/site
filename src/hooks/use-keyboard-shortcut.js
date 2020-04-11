import { useHotkeys } from "react-hotkeys-hook"

/*
  Tiny wrapper around useHotkeys, so we can call preventDefault on every
  stroke. Otherwise, an unwanted keystroke might appear, e.g. if the 
  shortcut brings up a dialog with a form in it.
*/
export default function (f) {
  useHotkeys("/", (event) => {
    event.preventDefault()
    f()
  })
}
