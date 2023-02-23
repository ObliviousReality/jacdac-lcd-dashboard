from numpy import *
from PIL import Image
from os import listdir

outfile = open("src/sprites.json", "w")
tsfile = open("src/SpriteTypes.ts", "w")

outfile.write("{\n")

tsfile.write("export enum SpriteTypes {\n")

id = 0

spriteCount = len(listdir("sprites"))
spriteCounter = 0

for file in listdir("sprites"):
    spriteName = file.split(".")[0]
    im = Image.open("sprites/" + file)
    x = asarray(im)
    width = size(x, 1)
    height = size(x, 0)
    data = []
    for i in x:
        buf = []
        for j in i:
            buf.append("1" if j[3] == 255 else "0")
        data.append(buf)

    outfile.write('\n"' + str(id) + '": {\n')
    outfile.write('"name": "' + spriteName + '",\n')
    id += 1
    outfile.write('"width": ' + str(width) + ',\n')
    outfile.write('"height": ' + str(height) + ',\n')
    outfile.write('"data": [\n')
    count = 0
    for item in data:
        if (count == len(data) - 1):
            outfile.write('[' + ",".join(item) + ']\n')
        else:
            outfile.write('[' + ",".join(item) + '],\n')
            count += 1
    if (spriteCounter == spriteCount - 1):
        outfile.write(']\n}\n')
        tsfile.write("\t" + spriteName + "\n")
    else:
        tsfile.write("\t" + spriteName + ",\n")
        outfile.write(']\n},\n')
        spriteCounter += 1
    im.close()

tsfile.write("}")
outfile.write('\n}')
outfile.close()
tsfile.close()
