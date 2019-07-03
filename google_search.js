/* eslint-disable linebreak-style */
const { Builder, By, until } = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/chrome");
const excel = require("./excel");
require("chromedriver");

const url = "https://google.com";
let driver;
const suffix = "youtube";
let arrayDuplicate = [];
const metaData = [];

async function openChrome() {
  return new Promise(async resolve => {
    driver = new Builder()
      .forBrowser("chrome")
      .setChromeOptions(
        new Options().addArguments("document-user-activation-required")
      )
      .build();
    driver.then(() => {
      resolve();
    });
  });
}

const openTabs = async count => {
  await driver.executeScript("window.open(); window.focus();");
  const newCount = count - 1;
  if (count > 1) return openTabs(newCount);
  return null;
};

const searchTheTerm = async searchTerm => {
  // eslint-disable-next-line no-console
  console.log(searchTerm);
  const searchLocator = By.name("q");
  const iAmFeelingLuckyLocator = By.css(
    '.FPdoLc.VlcLAe input[aria-label="I\'m Feeling Lucky"]'
  );
  // const inputScript = `document.getElementsByName('q')[0].value='${searchTerm} ${suffix}'`;
  // console.log(inputScript);
  try {
    return (
      driver
        .get(url)
        // .then(async () => {
        //   await driver.findElement(async () =>
        //     driver
        //       .wait(until.elementLocated(searchLocator))
        // .then(await driver.executeScript(inputScript))
        // .then(
        //   await driver.executeScript(
        //     `console.log(document.getElementsByName('q')[0].value)`
        //   )
        // )
        //       .sendKeys(`${searchTerm} ${suffix}`)
        //   );
        // })
        .then(
          await driver
            .findElement(async () =>
              driver.wait(until.elementLocated(searchLocator))
            )
            .sendKeys(`${searchTerm} ${suffix}`)
        )
        .then(
          await driver
            .findElement(async () =>
              driver.wait(until.elementLocated(iAmFeelingLuckyLocator))
            )
            .then(
              await driver.executeScript(
                'document.querySelector("#tsf > div:nth-child(2) > div > div.FPdoLc.VlcLAe > center > input[type=submit]:nth-child(2)").click()'
              )
            )
            .then(async () => {
              if (suffix.toLowerCase().indexOf("youtube") >= -1) {
                await driver.executeScript(
                  "window.stop(); var elem = document.querySelector('body');elem.parentNode.removeChild(elem)"
                );
                const pageURL = await driver.getCurrentUrl();
                let pageTitle = await driver.getTitle();
                pageTitle = pageTitle.substring(
                  0,
                  pageTitle.indexOf(" - YouTube")
                );
                metaData.push({ pageURL, pageTitle });
              }
              return true;
            })
        )
        .then(
          await driver.executeScript(
            'videos = document.querySelectorAll("video"); for(video of videos) {video.pause()}'
          )
        )
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log("@@@@Failure", searchTerm);
    // eslint-disable-next-line no-console
    console.log("@@@@Reason", err);
    return 1;
  }
};

async function windowSwitcher(searchTerm) {
  await driver.switchTo().window(arrayDuplicate[arrayDuplicate.length - 1]);
  await searchTheTerm(searchTerm).then(arrayDuplicate.pop());
}

const mainLoop = async (arr, count) => {
  if (count <= arr.length - 1) {
    const searchTerm = arr[count].toString();
    await windowSwitcher(searchTerm, count);
    const newCount = count + 1;
    mainLoop(arr, newCount);
  }
};

const getHandles = async () => {
  await driver.getAllWindowHandles().then(async handles => {
    arrayDuplicate = handles;
    /*
      Selenium issue
      https://github.com/w3c/webdriver/issues/386

      Using a temporary workaround
    */
    arrayDuplicate.push(arrayDuplicate.shift());
  });
};

const passToDev = async arr => {
  await openChrome();
  await openTabs(arr.length - 1);
  await getHandles();
  // eslint-disable-next-line no-console
  console.log("Search terms history:");
  await mainLoop(arr, 0);
};

const getData = () => excel.getDataFromExcel();

const start = async () => getData().then(result => passToDev(result[0].data));

exports.start = start;
exports.metaData = metaData;
