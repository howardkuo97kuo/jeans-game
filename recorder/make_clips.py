"""Make voice clips for words the game cannot say with clips.json yet.

Usage:
  pip install edge-tts
  python recorder/make_clips.py recorder/missing-lines.txt --voice en-US-AnaNeural

Pass the same voice that the existing clips use so the whole game sounds like one voice.
Each missing word is generated once and added to clips.json (existing clips are never replaced).
"""
import argparse, asyncio, base64, json, re, sys, tempfile, pathlib

ap = argparse.ArgumentParser()
ap.add_argument('lines')
ap.add_argument('--voice', default='en-US-AnaNeural')
ap.add_argument('--rate', default='-10%')
ap.add_argument('--clips', default=str(pathlib.Path(__file__).resolve().parent.parent / 'clips.json'))
a = ap.parse_args()

clips = json.load(open(a.clips))
words = []
for line in open(a.lines, encoding='utf-8'):
    for w in re.findall(r"[a-z0-9'\-]+", line.lower()):
        if w not in clips and w not in words and not w.isdigit():
            words.append(w)
print(len(words), 'missing words:', ', '.join(words))
if not words:
    sys.exit(0)

import edge_tts

async def main():
    for w in words:
        with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as f:
            path = f.name
        await edge_tts.Communicate(w, a.voice, rate=a.rate).save(path)
        clips[w] = base64.b64encode(open(path, 'rb').read()).decode()
        print('added', w)
    json.dump(clips, open(a.clips, 'w'), separators=(',', ':'))
    print('saved', a.clips)

asyncio.run(main())
