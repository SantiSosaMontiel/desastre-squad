#!/usr/bin/env python3
"""
Servidor local simple para probar la aplicación Age of Empires Stats
"""

import http.server
import socketserver
import os
import json
import webbrowser
import urllib.parse
import urllib.request
from pathlib import Path

# Configuración del servidor
PORT = 8000
DIRECTORY = Path(__file__).parent

RM_1V1_LEADERBOARD_ID = 3  # Random Map 1v1

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)
    
    def end_headers(self):
        # Agregar headers CORS para permitir fetch
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_GET(self):
        # Emula en local la función serverless de Netlify (/api/elo).
        if self.path.startswith('/api/elo'):
            return self._handle_elo()
        return super().do_GET()

    def _send_json(self, status, payload):
        body = json.dumps(payload).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(body)

    def _handle_elo(self):
        query = urllib.parse.urlparse(self.path).query
        profile_id = urllib.parse.parse_qs(query).get('profile_id', [''])[0]
        if not profile_id.isdigit():
            return self._send_json(400, {'error': 'profile_id invalido'})

        url = (
            'https://aoe-api.worldsedgelink.com/community/leaderboard/getpersonalstat'
            f'?title=age2&profile_ids=[{profile_id}]'
        )
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode('utf-8'))
            stats = data.get('leaderboardStats', []) or []
            rm = next((s for s in stats if s.get('leaderboard_id') == RM_1V1_LEADERBOARD_ID), None)
            rating = rm.get('rating') if rm else None
            return self._send_json(200, {'profile_id': int(profile_id), 'rating': rating})
        except Exception as err:  # noqa: BLE001
            return self._send_json(502, {'error': str(err)})

def main():
    # Cambiar al directorio del script
    os.chdir(DIRECTORY)
    
    # Crear el servidor (multihilo: maneja varias peticiones a la vez)
    with http.server.ThreadingHTTPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🚀 Servidor iniciado en http://localhost:{PORT}")
        print(f"📁 Sirviendo archivos desde: {DIRECTORY}")
        print(f"🌐 Abriendo navegador automáticamente...")
        print(f"⏹️  Presiona Ctrl+C para detener el servidor")
        
        # Abrir navegador automáticamente
        webbrowser.open(f'http://localhost:{PORT}')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print(f"\n🛑 Servidor detenido")

if __name__ == "__main__":
    main() 