const itemSetWithId = require("./dataSetWithId.json");
const _ = require("lodash");
const { Apriori, Itemset, IAprioriResults } = require("node-apriori");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.get("/retarget/:itemId", async (req, res, next) => {
  const params = req.params.itemId;
  const data = await retarget(params);
  res.json({
    success: true,
    data
  });
});

async function retarget(currentId) {
  const minimumSupport = 5;
  let final = [];

  const filtered = itemSetWithId.filter(itemSet => {
    return itemSet.some(item => item == currentId);
  });

  filtered.forEach(item => {
    let a = [];
    item.forEach(u => {
      if (u !== currentId) {
        a = [...a, u];
      }
    });
    final = [...final, a];
  });

  let apriori = new Apriori(0.1);

  let result = await apriori.exec(final);
  let frequentItemsets = result.itemsets;
  let executionTime = result.executionTime;
  let finalItems = [];
  frequentItemsets.forEach(item => {
    item.items.forEach(i => {
      finalItems = [...finalItems, i];
    });
  });
  return {
    finalItems: _.uniq(finalItems).filter(item => item != currentId)
  };
}

app.listen(3001, err => {
  if (!err) {
    console.log("App started in port 3001");
  }
});

// const threshold = 3;
// let candidateTable1 = {};

// const frequencyTable = {};
// const candidateTable = {};
// let finalCandidateTableArr = [];
// filtered.forEach(itemSet => {
//   itemSet.forEach(item => {
//     if (frequencyTable[item]) {
//       frequencyTable[item] = frequencyTable[item] + 1;
//       if (frequencyTable[item] > minimumSupport) {
//         candidateTable[item] = frequencyTable[item];
//       }
//     } else {
//       frequencyTable[item] = 1;
//     }
//   });
// });

// console.log({ filtered });

// // Object.keys(candidateTable).forEach(candidate => {
// //   filtered.forEach(arr => {
// //     arr.forEach((item, index) => {
// //       let a = [];
// //       let chkrpt = {};
// //       arr.some((p, index1) => {
// //         if (p !== item) {
// //           if (index1 > index) {
// //             a = [...a, p];
// //           }
// //           if (a.length == threshold) {
// //             return true;
// //           }
// //         }
// //       });

// //       if (a.length === threshold) {
// //         a = sortArray(a).join(",");
// //         finalCandidateTableArr = [...finalCandidateTableArr, a];
// //       }
// //     });
// //   });
// // });

// // function sortString(a) {
// //   return a
// //     .split(",")
// //     .map(b => Number(b))
// //     .sort();
// // }

// // function sortArray(a) {
// //   return a.map(b => Number(b)).sort((a, b) => b - a);
// // }

// // console.log(_.groupBy(finalCandidateTableArr, item => item));
