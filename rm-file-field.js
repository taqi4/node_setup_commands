#!/usr/bin/env node
const fs = require('fs');
const readline = require('readline-sync');
var file = fs.readFileSync("./core/middlewares/fileMiddleware.js","utf-8");
var content = file.split("\n");
console.log("enter field name to remove:");
var ans1 = readline.question();
content.splice(content.length-1,0,`fields = fields.filter((e)=>e.name!=${ans1});\n`);
content=content.join("\n");

fs.writeFileSync("./core/middlewares/fileMiddleware.js",content);