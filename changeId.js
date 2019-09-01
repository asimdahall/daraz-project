const json = require("./darajProductData.json");
const fs = require("fs");

let newJson = [];

json.forEach((data, ind) => {
  newJson = [
    ...newJson,
    {
      ...data,
      id: ind
    }
  ];
});

fs.writeFile("darajProductData.json", JSON.stringify(newJson), err => {
  if (err) {
    console.log("Error coocured");
  }
});
