/**
 * Example from https://gist.github.com/dbushell/2207ee93f5d751c526c8909fd2f8ad28
 */

const path = require("path");
const PNG = require("pngjs").PNG;
const EPD = require("../rpi-gpio-epaper");

function readImage(imagePath) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(imagePath)
      .pipe(new PNG())
      .on("parsed", function() {
        const image = EPD.createImage(this.width, this.height);
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            image.view[y].writeUInt8(
              EPD.toUInt8(
                this.data[(this.width * y + x) << 2] > 128 ? 0xff : 0x00
              ),
              x,
              1
            );
          }
        }
        resolve(image);
      });
  });
}

async function run() {
  let screen = new EPD();
  await screen.init();

  const imagePath = path.resolve(process.cwd(), "test.png");
  const image = await readImage(imagePath);

  const data = EPD.getImageRAM(image);
  await screen.writeDisplayFull(data);

  await screen.exit();
  screen = null;

  await EPD.sleep(500);
}

run();
