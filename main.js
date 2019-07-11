/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const sanitize = require("sanitize-filename");
const automation = require("./google_search");
const Downloader = require("./downloader.js");

const dl = new Downloader();
let i = 0;

const audio = (videoID, fileName) => {
  try {
    const safeFileName = sanitize(fileName);

    console.log("videoID: ", videoID);
    return new Promise(resolve => {
      dl.getMP3(
        { videoId: videoID, name: `${safeFileName}.mp3` },
        (err, res) => {
          i += 1;
          if (err) throw err;
          else {
            console.log(`Song ${i} was downloaded: ${res.file}`);
            resolve();
          }
        }
      );
    });
  } catch (err) {
    console.log("Exception caught:", err);
  }
  return 1;
};

const audioLoop = async (metaData, count) => {
  const urlString = metaData[count].pageURL;
  const url = new URL(urlString);
  const v = url.searchParams.get("v");

  await audio(v, metaData[count].pageTitle);
  const newCount = count - 1;
  if (newCount >= 0) audioLoop(metaData, newCount);
};

// eslint-disable-next-line no-unused-vars
const downloadMP3s = async metaData => {
  console.log(metaData);
  const c = await audioLoop(metaData, metaData.length - 1);
};

const r = async () => {
  const c = await automation.start();
  await downloadMP3s(automation.metaData);
};

r();

// audio("T-qF0JlzB2E","x");
// audio("Vhd6Kc4TZls","y");
// audio("w6YBWFVJKUc","z");
// audio("hGMrM2o-KiA","a");
// audio("phOW-CZJWT0","b");
