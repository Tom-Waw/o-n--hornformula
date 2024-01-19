#!/bin/bash

# Set your Mac IP address
IP=$(/usr/sbin/ipconfig getifaddr en0)
# Allow connections from Mac to XQuartz
/opt/X11/bin/xhost + "$IP"

docker build -t horn_formula .
docker run \
    -it \
    --rm \
    -e DISPLAY="${IP}:0" \
    -v /tmp/.X11-unix:/tmp/.X11-unix \
    -v $(pwd)/src:/app \
    horn_formula \
    watchmedo auto-restart --pattern=*.py --recursive -- python main.py