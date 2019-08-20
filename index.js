const puppeteer = require("puppeteer");
const $ = require("cheerio");
const fs = require("fs");
const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const url = "https://www.daraz.com.np/";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

const desc = lorem.generateSentences(5);

let page, browser;
let finalData = [];
(async function() {
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
  await page.goto(url, { timeout: 30000000 });

  await page.evaluate(async () => {
    let elements = document.getElementsByClassName("button J_LoadMoreButton");
    for (i = 0; i < 20; i++) {
      await elements[0].click();
    }
  });

  await page.waitFor(10000);
  let html = await page.content();
  scrapData(html);
})();

function scrapData(html) {
  let cardNode = $(".card-jfy-image-background", html);
  let priceCardNode = $(".hp-mod-price-first-line", html);
  let descCardNode = $(".card-jfy-title", html);
  for (let i = 0; i < cardNode.length; i++) {
    let image = cardNode[i].children[1].attribs.src;

    let title = descCardNode[i].children[0].children[0].data;

    let price = priceCardNode[i].children[2].children[0].data;
    finalData = [...finalData, { image, title, price, desc, id: i }];
  }

  fs.appendFile(
    "darajProductData.json",
    JSON.stringify(finalData, null, 1),
    err => {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
    }
  );
}
