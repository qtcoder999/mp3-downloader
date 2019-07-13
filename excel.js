/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
/* eslint-disable linebreak-style */
/* eslint-disable no-console */
const fs = require("fs");
const xlsx = require("node-xlsx");
const json2xls = require("json2xls");

const writeToXLS = data => {
  try {
    const xls = json2xls(data);

    fs.writeFileSync("output.xlsx", xls, "binary");
  } catch (err) {
    console.error(err);
  }
};

const getDataFromExcel = async () => {
  let obj = xlsx.parse(`${__dirname}/input.xlsx`); // parses a file

  obj = xlsx.parse(fs.readFileSync(`${__dirname}/input.xlsx`)); // parses a buffer

  return obj;
  // walk(obj);
};

exports.getDataFromExcel = getDataFromExcel;
exports.writeToXLS = writeToXLS;
