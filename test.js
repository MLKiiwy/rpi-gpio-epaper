const EPD = require("./lib/epd");

async function run() {
  console.log("Test start");

  let screen = new EPD();
  await screen.init();

  await screen.writeDisplayFull(data);
  await EPD.sleep(2000);
  await screen.exit();
  screen = null;

  await EPD.sleep(500);
}

run();
