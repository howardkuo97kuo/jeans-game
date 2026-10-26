"""Make voice clips with Microsoft Edge text-to-speech and write them into clips.json.

  pip install edge-tts
  python recorder/make_clips.py recorder/missing-lines.txt --voice en-GB-SoniaNeural        # only words clips.json lacks
  python recorder/make_clips.py recorder/missing-lines.txt --voice en-GB-SoniaNeural --all  # redo every clip in one voice

The same thing runs in the cloud from the "Make voice clips" GitHub Action (Actions tab, Run workflow).
"""
import argparse, asyncio, base64, json, re, sys, tempfile, pathlib

PHON = {'a':'aah','b':'buh','c':'kuh','d':'duh','e':'eh','f':'fff','g':'guh','h':'huh','i':'ih','j':'juh','k':'kuh','l':'lll','m':'mmm','n':'nnn','o':'aw','p':'puh','q':'kwuh','r':'rrr','s':'sss','t':'tuh','u':'uh','v':'vvv','w':'wuh','x':'ks','y':'yuh','z':'zzz'}
# Letter sound followed by a sample word, used for the 'ph_' clips (letter introductions)
PHON_WORD = {'a': 'ah. Apple', 'b': 'buh. Ball', 'c': 'kuh. Cat', 'd': 'duh. Dog', 'e': 'eh. Egg', 'f': 'ff. Fish', 'g': 'guh. Goat', 'h': 'huh. Hat', 'i': 'ih. Igloo', 'j': 'juh. Jam', 'k': 'kuh. Kite', 'l': 'll. Lion', 'm': 'mm. Moon', 'n': 'nn. Nest', 'o': 'aw. Octopus', 'p': 'puh. Pig', 'q': 'kwuh. Queen', 'r': 'rr. Rabbit', 's': 'ss. Sun', 't': 'tuh. Tree', 'u': 'uh. Umbrella', 'v': 'vv. Van', 'w': 'wuh. Watch', 'x': 'ks. Fox', 'y': 'yuh. Yo-yo', 'z': 'zz. Zebra'}

ap = argparse.ArgumentParser()
ap.add_argument('lines')
ap.add_argument('--voice', default='en-GB-SoniaNeural')
ap.add_argument('--rate', default='-8%')
ap.add_argument('--pitch', default='+4Hz')
ap.add_argument('--all', action='store_true', help='regenerate every existing clip too')
ap.add_argument('--clips', default=str(pathlib.Path(__file__).resolve().parent.parent / 'clips.json'))
a = ap.parse_args()

clips = json.load(open(a.clips))
todo = []  # (key, text)
if a.all:
    for k in clips:
        if k.startswith('ph_'): continue
        todo.append((k, PHON[k[4:]] if k.startswith('snd_') and k[4:] in PHON else k))
seen = {k for k, _ in todo}
for l, t in PHON_WORD.items():
    if a.all or 'ph_' + l not in clips:
        todo.append(('ph_' + l, t))
seen = {k for k, _ in todo}
for line in open(a.lines, encoding='utf-8'):
    for w in re.findall(r"[a-z0-9'\-]+", line.lower()):
        if w not in clips and w not in seen and not w.isdigit():
            seen.add(w); todo.append((w, w))
print(len(todo), 'clips to make with', a.voice)
if not todo:
    sys.exit(0)

import edge_tts

async def one(key, text, sem):
    async with sem:
        for attempt in range(4):
            try:
                with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as f:
                    path = f.name
                await edge_tts.Communicate(text, a.voice, rate=a.rate, pitch=a.pitch).save(path)
                data = open(path, 'rb').read()
                if len(data) > 500:
                    clips[key] = base64.b64encode(data).decode()
                    return
            except Exception as e:
                print('retry', key, e)
                await asyncio.sleep(1 + attempt)
        print('FAILED', key)

async def main():
    sem = asyncio.Semaphore(4)
    await asyncio.gather(*(one(k, t, sem) for k, t in todo))
    json.dump(clips, open(a.clips, 'w'), separators=(',', ':'))
    print('saved', len(clips), 'clips')

asyncio.run(main())
