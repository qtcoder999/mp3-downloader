/* eslint-disable linebreak-style */
const fs = require("fs");
const xlsx = require("node-xlsx");

// function walk(obj) {
//   for (let i in obj) {
//     if (typeof obj[i] === "object" && !(obj[i] instanceof Array)) {
//       walk(obj[i]);
//       console.log(obj[i]);
//     }
//   }
// }
const getDataFromExcel = async () => {
  let obj = xlsx.parse(`${__dirname}/myFile.xlsx`); // parses a file

  obj = xlsx.parse(fs.readFileSync(`${__dirname}/myFile.xlsx`)); // parses a buffer

  return obj;
  // walk(obj);
};

exports.getDataFromExcel = getDataFromExcel;
