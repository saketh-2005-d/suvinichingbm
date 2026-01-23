#!/usr/bin/env python3
"""
NutriPlan Web Server
Serves the NutriPlan website on localhost and your network
"""

import http.server
import socketserver
import socket
import os
import sys
from pathlib import Path

PORT = 3000
SCRIPT_DIR = Path(__file__).parent

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=SCRIPT_DIR, **kwargs)
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_GET(self):
        if self.path == '/':
            self.path = '/nutriplan.html'
        return super().do_GET()

def get_local_ip():
    """Get local IP address"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return 'localhost'

def main():
    local_ip = get_local_ip()
    
    try:
        with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            print("\n" + "="*40)
            print("🥗 NutriPlan Server Started!")
            print("="*40 + "\n")
            print("Access the website at:\n")
            print(f"  Local:    http://localhost:{PORT}")
            print(f"  Network:  http://{local_ip}:{PORT}")
            print("\n📱 Share this URL with other devices on the network!")
            print("\n✋ Press Ctrl+C to stop the server\n")
            
            httpd.serve_forever()
    except OSError as e:
        if e.errno == 48 or e.errno == 98:  # Port already in use
            print(f"\n❌ Port {PORT} is already in use.")
            print("Try using a different port or close the app using this port.\n")
        else:
            print(f"\n❌ Error: {e}\n")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n\n✋ Server stopped.\n")
        sys.exit(0)

if __name__ == '__main__':
    main()
