# Jean's Game (Princess Pals)

A letters and numbers game for a young child, built as a single web page.

- `block-pals.html` is the whole game. Open it through a web server (for example `python -m http.server`) so it can load `clips.json`.
- `clips.json` holds the voice clips (base64 audio) played by the game. Without it the game falls back to the device's own voice.
- `recorder/` is a small local tool for recording the 26 letter sounds with your own voice. Run `python recorder/server.py`, then open http://localhost:8766.

Activities: finding letters and numbers, big and small letters, letter sounds, building words, sight words, counting, which group has more or fewer, adding, taking away, multiplying (groups, arrays, times tables, skip counting), counting to 100, and tracing.

Every activity has three levels (easy, normal, challenge). Three first-try answers in a row move up a level inside a round; two misses in a row move down one. Tracing goes from a thick guide, to a thinner guide with fewer dots, to tracing from memory. On the top level a gentle timer bar runs (it can be turned off in the grown-ups settings; nothing bad happens when it runs out), and long streaks or speedy rounds earn a bonus sticker.

Pictures are original inline SVG drawings: about 80 of them, three or more for each letter (shown after a right answer and in the letter sound questions), plus sticker pages for pets, zoo animals, fruit and vehicles. Progress is saved in the browser. A grown-ups area (hold the corner gear for 2.5 seconds) has progress charts and settings.

The characters are original designs. Voice clips were generated with Microsoft's Edge text-to-speech.

Also: shapes and colours, and colour patterns (the Shapes card on the home screen); a daily goal ring on the home screen and a weekly report in the grown-ups area; and install-to-home-screen with offline play (`manifest.json`, `sw.js`, `icon.svg`; needs the game to be served over https or localhost).

Princess theme: an original princess (brown hair, gold tiara, red and gold gown) guides the game, with a sunset castle, roses and butterflies behind it and a princess sticker page. The letter and number blocks are still her friends. New: Time (read the clock, find the clock), Animals (names, sounds, where they live), and a Multiply menu (groups, adding up fast, rows and columns, times tables, sharing equally).

Voice tooling: lines the game could not say from `clips.json` are listed in `recorder/missing-lines.txt` (the grown-ups settings can also copy the live list). `python recorder/make_clips.py recorder/missing-lines.txt --voice <the voice used for the existing clips>` makes clips for the missing words so everything sounds like one voice (needs `pip install edge-tts` and internet).
Princess extras: stars from every round unlock six gowns in the Gowns wardrobe; reaching the daily goal gives a daily gift sticker; the home screen has a "Princess picks for you" card that suggests the next activity.
