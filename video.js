/* eslint-disable linebreak-style */
/* eslint-disable no-console */
const YoutubeMp3Downloader = require("youtube-mp3-downloader");

// Configure YoutubeMp3Downloader with your settings
const YD = new YoutubeMp3Downloader({
  ffmpegPath: "./ffmpeg/bin/ffmpeg.exe", // Where is the FFmpeg binary located? TODO: Set correct path before testing!
  outputPath: "./mp3", // Where should the downloaded and encoded files be stored? TODO: Set correct path before testing!
  youtubeVideoQuality: "highest", // What video quality should be used?
  queueParallelism: 2, // How many parallel downloads/encodes should be started?
  progressTimeout: 2000 // How long should be the interval of the progress reports
});

// Download video and save as MP3 file
// YD.download("Vhd6Kc4TZls", "Cold Funk - Funkorama.mp3");

YD.on("finished", (err, data) => {
  console.log(`Song ${data.title} has been downloaded`);
});

YD.on("error", error => {
  console.log(error);
});

// YD.on("progress", progress => {
//   console.log(`${Math.round(progress.progress.percentage)} %`);
// });

const audio = (videoID, fileName) => {
  YD.download(videoID, `${fileName}.mp3`);
};

exports.audio = audio;
