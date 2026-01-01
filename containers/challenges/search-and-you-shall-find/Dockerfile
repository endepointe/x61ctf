from alpine:latest

run apk add --no-cache python3 py3-pip

workdir /opt/ctf

copy server.py /opt/ctf/server.py
run chmod +x /opt/ctf/server.py

expose 31337/udp

cmd ["python3", "/opt/ctf/server.py"]

