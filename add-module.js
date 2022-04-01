#!/usr/bin/env node

var addModule = process.argv[2].split("=")[1];
const fs = require('fs');
var moduleList = fs.readdirSync("./api");

if (moduleList.includes(addModule)) {
    console.log("module ", addModule, "already exists")
} else if (!addModule) {
    console.log("enter --name=modulename");
} else {
    fs.mkdir(`./api/${addModule}`, () => {
        console.log("created folder", addModule);
    });
    fs.mkdir(`./api/${addModule}/controllers`, () => {
        console.log("created controllers");
    });
    fs.mkdir(`./api/${addModule}/middlewares`, () => {
        console.log("created middlewares");
    });
    fs.mkdir(`./api/${addModule}/services`, () => {
        console.log("created services");
    });
    fs.mkdir(`./api/${addModule}/functions`, () => {
        console.log("created functions");
    });
    fs.writeFileSync(`./api/${addModule}/route.json`,
        `[
        {
            "method": "",
            "path": "",
            "controller": "",
            "middlewares": []            ],
            "gloabal":true,
            "roles":[]
        }]`
    );
    console.log("successfully added module", addModule);
}