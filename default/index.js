const Config = require("./Config.json");
const Data = require("./data.json");
const fs = require("fs");

function toSnakeCase(inputString, delim = "_") {
    const str = [];
    const array = inputString.split("");
    for (let index = 0; index < array.length; index++) {
      const character = array[index];
      if (isNaN(character) && character === character.toUpperCase()) {
        if (!(index > 0 && array[index - 1] === array[index - 1].toUpperCase())) str.push(delim);
        str.push(character.toUpperCase());
      } else {
        str.push(character);
      }
    }
    return str.join("");
  }
  
function recurr(title, prop, data) {
    prop.label = toSnakeCase(title, " ");
  switch (prop.type) {
    case "array":
      prop.items[0] = recurr(title, prop.items[0], data[0]);
      break;
    case "object":
      const keys = Object.keys(prop.properties);
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        prop.properties[key] = recurr(key, prop.properties[key], data[key]);
      }
      break;
    case "string":
      if (!!data) {
        prop.default = data;
      }
      break;
    case "integer":
    case "number":
      prop.default = !!data ? Number(data) : 0;
      break;
    case "boolean":
      prop.default = !!data ? Boolean(data) : false;
      break;
  }
  return prop;
}

fs.writeFileSync("Output.json", JSON.stringify(recurr("Custom", Config, Data), null, 2));
