# Jean's Game (Block Pals)

A letters and numbers game for a young child, built as a single web page.

- `block-pals.html` is the whole game. Open it through a web server (for example `python -m http.server`) so it can load `clips.json`.
- `clips.json` holds the voice clips (base64 audio) played by the game. Without it the game falls back to the device's own voice.
- `recorder/` is a small local tool for recording the 26 letter sounds with your own voice. Run `python recorder/server.py`, then open http://localhost:8766.

Activities: finding letters and numbers, letter sounds, building words, sight words, counting, adding, taking away, groups and skip counting, counting to 100, and tracing. Progress is saved in the browser. A grown-ups area (hold the corner gear for 2.5 seconds) has progress charts and settings.

The characters are original designs. Voice clips were generated with Microsoft's Edge text-to-speech.
