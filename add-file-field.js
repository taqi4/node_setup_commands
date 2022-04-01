#!/usr/bin/env node
const fs = require('fs');
const readline = require('readline-sync');
var file = fs.readFileSync("./core/middlewares/fileMiddleware.js","utf-8");
var content = file.split("\n");
console.log("enter field name :");
var ans1 = readline.question();
console.log("enter field maxCount :");
var ans2 = readline.question();
content.splice(content.length-1,0,`fields.push({name:"${ans1}",maxCount:${ans2}});\n`);

content = content.join("\n");
fs.writeFileSync("./core/middlewares/fileMiddleware.js",content);

