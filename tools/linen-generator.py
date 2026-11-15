import zlib, struct, random, math, sys
W=H=240; random.seed(7)
# per-thread brightness variation (slubs)
rows=[random.gauss(0,1) for _ in range(H)]
cols=[random.gauss(0,1) for _ in range(W)]
slub_r=[[random.gauss(0,1) for _ in range(W//20+2)] for _ in range(H)]
def lerp(a,b,t): return a+(b-a)*t
px=bytearray()
for y in range(H):
    px.append(0)
    for x in range(W):
        # periodic thread pitch 3px; warp/weft over-under
        wy=(y%3); wx=(x%3)
        over = ((x//3)+(y//3))%2
        v = 0.0
        if over: v += 0.55*cols[x]*0.5 + (0.35 if wx==1 else -0.25)
        else:    v += 0.55*rows[y]*0.5 + (0.35 if wy==1 else -0.25)
        # slub along weft
        i=x/20; s=lerp(slub_r[y][int(i)%12],slub_r[y][(int(i)+1)%12],i-int(i))
        v += 0.25*s + random.gauss(0,0.18)
        if v>=0: r=g=b=255; a=int(min(1,v)*34)
        else: r=g=b=20; a=int(min(1,-v)*40)
        px += bytes((r,g,b,a))
def chunk(t,d): return struct.pack('>I',len(d))+t+d+struct.pack('>I',zlib.crc32(t+d)&0xffffffff)
png=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',W,H,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(bytes(px),9))+chunk(b'IEND',b'')
open(sys.argv[1],'wb').write(png)
