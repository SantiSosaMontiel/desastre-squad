#!/usr/bin/env python3
"""
Servidor local simple para probar la aplicación Age of Empires Stats
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Configuración del servidor
PORT = 8000
DIRECTORY = Path(__file__).parent

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)
    
    def end_headers(self):
        # Agregar headers CORS para permitir fetch
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def main():
    # Cambiar al directorio del script
    os.chdir(DIRECTORY)
    
    # Crear el servidor
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
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