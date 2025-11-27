#!/usr/bin/env python3
"""
Dual-mode small CTF service:
 - UDP responder on port 1337: replies with FLAG for any UDP packet.
 - ICMP echo responder (raw socket): replies to ICMP echo requests with FLAG in payload.

WARNING: Raw sockets require root / CAP_NET_RAW. Run only in a safe lab environment.
"""

import socket
import threading
import struct
import sys
import time

FLAG = b"flag{this_is_the_flag}"

# ---------- UDP responder (port 1337) ----------
def udp_responder(bind_host="0.0.0.0", bind_port=1337):
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind((bind_host, bind_port))
    print(f"[udp] listening on {bind_host}:{bind_port}/udp")
    try:
        while True:
            data, addr = sock.recvfrom(4096)
            print(f"[udp] recv {len(data)} bytes from {addr}, replying with flag")
            try:
                sock.sendto(FLAG, addr)
            except Exception as e:
                print(f"[udp] sendto error: {e}")
    except KeyboardInterrupt:
        pass
    finally:
        sock.close()


# ---------- ICMP responder (raw socket) ----------
# ICMP header: type (1), code (1), checksum (2), id (2), seq (2)
def icmp_checksum(data: bytes) -> int:
    # standard Internet checksum (RFC 1071)
    if len(data) % 2:
        data += b'\x00'
    s = sum(struct.unpack("!%dH" % (len(data)//2), data))
    s = (s >> 16) + (s & 0xffff)
    s += s >> 16
    return (~s) & 0xffff

def icmp_responder():
    try:
        # raw socket for ICMP
        sock = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_ICMP)
    except PermissionError:
        print("[icmp] permission denied: raw sockets require root / CAP_NET_RAW")
        sys.exit(1)
    except Exception as e:
        print(f"[icmp] socket error: {e}")
        sys.exit(1)

    print("[icmp] raw ICMP listener started (will reply to echo requests with the flag)")

    while True:
        pkt, addr = sock.recvfrom(65535)  # pkt includes ICMP header+payload only for RAW ICMP on many OSes
        # Depending on OS, recvfrom on raw ICMP returns the ICMP packet (not IP header) or may include IP header.
        # We will try to extract ICMP header reliably by scanning.
        # Typical ICMP echo request header starts with type=8.
        # Search for byte 8 near start:
        # Simpler approach: if packet len >= 8 and first byte == 8, parse from start.
        icmp_offset = 0
        if len(pkt) >= 8 and pkt[0] == 8:
            icmp_offset = 0
        else:
            # try to find the first occurrence of type 8
            pos = pkt.find(b'\x08')
            if pos != -1 and pos + 8 <= len(pkt):
                icmp_offset = pos
            else:
                # couldn't locate echo request; skip
                continue

        icmp_pkt = pkt[icmp_offset:]
        if len(icmp_pkt) < 8:
            continue

        icmp_type, icmp_code, icmp_cksum, icmp_id, icmp_seq = struct.unpack("!BBHHH", icmp_pkt[:8])
        payload = icmp_pkt[8:]
        if icmp_type != 8:  # only handle Echo Request (type 8)
            continue

        src_ip = addr[0]
        print(f"[icmp] Echo request from {src_ip}, id={icmp_id}, seq={icmp_seq}, replying with flag")

        # build echo reply (type 0)
        reply_type = 0
        reply_code = 0
        reply_id = icmp_id
        reply_seq = icmp_seq
        reply_payload = FLAG  # put the flag in the reply payload
        header = struct.pack("!BBHHH", reply_type, reply_code, 0, reply_id, reply_seq)
        ck = icmp_checksum(header + reply_payload)
        header = struct.pack("!BBHHH", reply_type, reply_code, ck, reply_id, reply_seq)
        reply_pkt = header + reply_payload

        try:
            sock.sendto(reply_pkt, (src_ip, 0))
        except Exception as e:
            print(f"[icmp] sendto error: {e}")

# ---------- main ----------
if __name__ == "__main__":
    # Start UDP responder thread
    t_udp = threading.Thread(target=udp_responder, args=("0.0.0.0", 1337), daemon=True)
    t_udp.start()

    # Start ICMP responder in main thread (will require root)
    try:
        icmp_responder()
    except KeyboardInterrupt:
        print("shutting down")
        time.sleep(0.1)
        sys.exit(0)

