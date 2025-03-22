# Network Image Gallery

A web-based image gallery application that allows you to view images from various network sources including WebDAV, SMB, FTP, and HTTP/HTTPS.

## Features

- Connect to multiple network sources
- Browse directories and view images
- Support for WebDAV, SMB, FTP, and HTTP/HTTPS protocols
- Thumbnail previews
- Full-screen image viewing with zoom capabilities
- Responsive design for mobile and desktop

## Supported Protocols

- **WebDAV**: Access images from WebDAV servers
- **FTP**: Connect to FTP servers to view images
- **SMB**: Browse and view images on SMB shares
- **HTTP/HTTPS**: View images from web servers or HTTP-based APIs

## Getting Started

1. Create a new connection from the home page
2. Enter your connection details for your chosen protocol
3. Browse your directories and view your images

## Technical Notes

- This app is designed to run in a web browser but can be installed as a PWA on Android devices
- FTP and SMB protocols require a backend proxy service in a production environment
- HTTP connections may have limitations with directory listings based on the server configuration