const itemSet = require("./itemset.json");
const productData = require("./darajProductData.json");

const fs = require("fs");
let mapNameToId = {};
let finalData = [];

itemSet.forEach(item => {
  let itemArr = [];
  item.forEach((x, index) => {
    if (index === 0) {
      return;
    } else {
      const product = productData.find(data => data.title === x);
      if (!mapNameToId[x] && product) {
        mapNameToId[x] = product && product.id;
      }
      itemArr = [mapNameToId[x], ...itemArr];
      console.log({ itemArr });
    }
  });
  finalData = [...finalData, itemArr];
});

console.log(finalData);
fs.writeFile("dataSetWithId.json", JSON.stringify(finalData), (err, e) => {
  console.log({
    err,
    e
  });
});
