const fs = require("fs");

const text = fs.readFileSync("./scenario.txt").toString();

// res містить інформацію про початкові і кінцеві індекси фрагментів тексту кожного персонажа
let a = text;
const res = {};
const b = [...a.matchAll(/^(Triss|Geralt|Max|Yennefer):/gim)];
for (let i = 0; i < b.length; i += 1) {
  const match = b[i];
  const [_1, characterName] = match;
  const { index } = match;
  if (res[characterName]) {
    res[characterName].push({
      start: index,
      end: b[i + 1] ? b[i + 1].index : a.length,
    });
    console.log;
  } else {
    res[characterName] = [
      {
        start: index,
        end: b[i + 1] ? b[i + 1].index : -1,
      },
    ];
  }
}

for (const characterName in res) {
  const arrInd = res[characterName];
  const result = [];

  //  в кожній ітерації циклу отримується фрагмент тексту для поточного персонажа, видаляється рядок з іменем персонажа, і цей фрагмент додається до масиву result
  for (const { start, end } of arrInd) {
    const line = text.substring(start, end);
    // replace видаляє рядок з ім'ям персонажа
    result.push(line.replace(`${characterName}: `, ""));
  }

  const linesText = result.join("\n");
  fs.writeFileSync(`./characters/${characterName}.txt`, linesText);

  console.log(`${characterName}: `, result);
  console.log(`${characterName}: `, result.length);
}