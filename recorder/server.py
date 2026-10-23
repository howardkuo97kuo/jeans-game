"""Tiny local server for the letter-sound recorder. Listens on this computer only (127.0.0.1)."""
import http.server, json, os, re, socketserver, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, 'rec')
os.makedirs(OUT, exist_ok=True)
PORT = 8766
EXT = {'audio/webm': 'webm', 'audio/ogg': 'ogg', 'audio/mp4': 'm4a', 'audio/mpeg': 'mp3', 'audio/wav': 'wav'}

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def _json(self, code, obj):
        body = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == '/status':
            saved = sorted({f.split('.')[0] for f in os.listdir(OUT) if re.fullmatch(r'[a-z]\.\w+', f)})
            return self._json(200, {'saved': saved})
        if self.path in ('/', ''):
            self.path = '/record.html'
        return super().do_GET()

    def do_POST(self):
        m = re.fullmatch(r'/save/([a-z])', self.path)
        if not m:
            return self._json(404, {'error': 'not found'})
        n = int(self.headers.get('Content-Length', 0))
        if n <= 0 or n > 3_000_000:
            return self._json(413, {'error': 'bad size'})
        data = self.rfile.read(n)
        ctype = (self.headers.get('Content-Type') or '').split(';')[0].strip()
        ext = EXT.get(ctype, 'webm')
        for old in os.listdir(OUT):
            if old.startswith(m.group(1) + '.'):
                os.remove(os.path.join(OUT, old))
        with open(os.path.join(OUT, f'{m.group(1)}.{ext}'), 'wb') as f:
            f.write(data)
        return self._json(200, {'ok': True, 'bytes': len(data)})

    def log_message(self, *a):
        pass

socketserver.ThreadingTCPServer.allow_reuse_address = True
with socketserver.ThreadingTCPServer(('127.0.0.1', PORT), Handler) as srv:
    print(f'Recorder ready at http://localhost:{PORT}', flush=True)
    srv.serve_forever()

