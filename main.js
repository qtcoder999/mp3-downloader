/* eslint-disable linebreak-style */
const automation = require("./google_search");
const audioDownloader = require("./video");

const audioLoop = (metaData, count) => {
  const urlString = metaData[count].pageURL;
  const url = new URL(urlString);
  const v = url.searchParams.get("v");
  audioDownloader.audio(v, metaData[count].pageTitle);
  const newCount = count - 1;
  if (newCount > 0) audioLoop(metaData, newCount);
};

// eslint-disable-next-line no-unused-vars
const downloadMP3s = metaData => {
  console.log(metaData);
  // audioLoop(metaData, metaData.length - 1);
};

automation.start().then(() => {
  downloadMP3s(automation.metaData);
});
