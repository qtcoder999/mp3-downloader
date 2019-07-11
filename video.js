/* eslint-disable no-console */
const Downloader = require("./downloader.js");

const dl = new Downloader();
let i = 0;

dl.getMP3(
  { videoId: "Vhd6Kc4TZls", name: "Cold Funk - Funkorama.mp3" },
  (err, res) => {
    i += 1;
    if (err) throw err;
    else {
      console.log(`Song ${i} was downloaded: ${res.file}`);
    }
  }
);
