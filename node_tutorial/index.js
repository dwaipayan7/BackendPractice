const { name } = require("ejs");

const jsonString = '{"name": "Dwaipayan", "age": 22, "city": "Bethuadahari"}'

const jsonObject = JSON.parse(jsonString)

console.log(jsonObject.name);



const objectToConvert = {
    name: 'Dwaipayan',
    age: 22
};

const json = JSON.stringify(objectToConvert);
console.log(json)

console.log(typeof json)