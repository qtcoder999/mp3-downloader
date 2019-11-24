/* eslint-disable linebreak-style */
const { Builder, By, until } = require("selenium-webdriver");
const excel = require("./excel");
require("chromedriver");

const url = "https://google.com";
let driver;
const suffix = "youtube.com";
let arrayDuplicate = [];
const metaData = [];

async function openChrome() {
  return new Promise(async resolve => {
    driver = new Builder().forBrowser("chrome").build();
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

const stopLoadingPage = async () =>
  new Promise(async resolve => {
    await driver.executeScript("window.stop();");
    await driver.executeScript(
      "var elem = document.querySelector('body'); elem.parentNode.removeChild(elem);"
    );
    resolve();
  });

const waitTillYouTubeOpens = () =>
  new Promise(async resolve => {
    const pageURL = await driver.getCurrentUrl();
    if (pageURL.toLowerCase().indexOf("youtube") > -1) {
      await stopLoadingPage();
      resolve(true);
    } else {
      waitTillYouTubeOpens();
    }
  });

const metaPush = async (pageTitle, pageURL) =>
  new Promise(async resolve => {
    metaData.push({ pageTitle, pageURL });
    resolve();
  });

const getTitlesAndURLs = async () =>
  new Promise(async resolve => {
    if (suffix.toLowerCase().indexOf("youtube") > -1) {
      await waitTillYouTubeOpens();
      let pageTitle = await driver.getTitle();
      pageTitle = pageTitle.substring(0, pageTitle.indexOf(" - YouTube"));
      const pageURL = await driver.getCurrentUrl();

      metaPush(pageTitle, pageURL);
      resolve();
    }
  });

const clickIamFeelingLuckyButton = async () => {
  // eslint-disable-next-line no-unused-vars
  const c = await driver.executeScript(
    'document.querySelector("#tsf > div:nth-child(2) > div.A8SBwf > div.FPdoLc.tfB0Bf > center > input.RNmpXc").click()'
  );
};

const searchTheTerm = async (searchTerm, count) =>
  new Promise(async resolveIt => {
    // eslint-disable-next-line no-console
    console.log(`${count + 1}. ${searchTerm}`);
    const searchLocator = By.name("q");
    const iAmFeelingLuckyLocator = By.css(
      "#tsf > div:nth-child(2) > div.A8SBwf > div.FPdoLc.tfB0Bf > center > input.RNmpXc"
    );

    try {
      return driver
        .get(url)
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
            .then(await clickIamFeelingLuckyButton())
            .then(await getTitlesAndURLs())
            .then(resolveIt())
        );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log("@@@@Failure", searchTerm);
      // eslint-disable-next-line no-console
      console.log("@@@@Reason", err);
    }
    return 1;
  });

async function windowSwitcher(searchTerm, count) {
  await driver.switchTo().window(arrayDuplicate[arrayDuplicate.length - 1]);
  await searchTheTerm(searchTerm, count).then(arrayDuplicate.pop());
  await driver.executeScript("window.close();");
}

const mainLoop = async (arr, count) => {
  if (count <= arr.length - 1) {
    const searchTerm = arr[count].toString();
    await windowSwitcher(searchTerm, count);
    const newCount = count + 1;
    await mainLoop(arr, newCount);
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

const passToDev = async arr =>
  new Promise(async resolve => {
    await openChrome();
    await openTabs(arr.length - 1);
    await getHandles();
    // eslint-disable-next-line no-console
    console.log("Search terms history:");
    await mainLoop(arr, 0);

    resolve();
  });

const getData = () => excel.getDataFromExcel();

const start = async () =>
  new Promise(async resolve => {
    getData().then(async result => {
      await passToDev(result[0].data);
      resolve();
    });
  });

exports.start = start;
exports.metaData = metaData;
