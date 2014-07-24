#! /usr/bin/env python

# Script to use python to run a simple, basic webserver suitable for using to test Superconductor.
# Superconductor needs to be loaded from a web server because it uses AJAX requests to fetch data.
# Due to security restrictions in the browser, these requests are not allowed to target local files,
# even if the requesting page is also local.

from SimpleHTTPServer import SimpleHTTPRequestHandler
import BaseHTTPServer

class CORSRequestHandler (SimpleHTTPRequestHandler):
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

if __name__ == '__main__':
    BaseHTTPServer.test(CORSRequestHandler, BaseHTTPServer.HTTPServer)
