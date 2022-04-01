#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const readline = require('readline-sync');
var inquirer = require('inquirer');
const multerWares = require("../../core/middlewares/fileMiddleware.js").multerWares;
var file = fs.readFileSync("./core/middlewares/fileMiddleware.js", "utf-8");
var content = file.split("\n");
console.log("enter middleware name :");
var middlewareName = readline.question();

if(Object.keys(multerWares).includes(middlewareName)){
    console.log("middleware already exists");
    process.exit(0);
}
console.log("enter number of fields to be entered: ");
var n = Number(readline.question());
var fields = [];
var ans2, ans3;
for (let i = 0; i < n; i++) {
    console.log("enter field name :");
    ans2 = readline.question();
    console.log("enter field maxCount :");
    ans3 = readline.question();
    fields.push({
        name: ans2,
        maxCount: ans3
    });
}
console.log("enter the path for storage");
var storagePath = readline.question();
if(!storagePath || fields.length<1 || !middlewareName){
    console.log("input error");
    process.exit(0);
}
content.splice(content.length - 1, 0, `createMulter("${storagePath}",${JSON.stringify(fields)},"${middlewareName}");\n`);
content = content.join("\n");
fs.writeFileSync("./core/middlewares/fileMiddleware.js", content);
var choices = fs.readdirSync("api");
inquirer.prompt([{type:"list",choices:choices,message:"Choose the mmodule ",name:"moduleName"},
{type:"input",name:"fileName",message:"Enter file name to store middleware"}]).then(ans=>{
    var fileName = ans.fileName+".js";
    var moduleName = ans.moduleName;
    var filePath = path.join("api",moduleName,"middlewares",fileName);
    if(fs.existsSync(filePath)){
        console.log(fileName,"already available in module",moduleName);
        process.exit(0);
    }
    fs.writeFileSync(filePath,`module.exports["${middlewareName}"] = framework.multerWares["${middlewareName}"];\n`);
});

console.log("SuccessFully Added",middlewareName);