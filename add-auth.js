#!/usr/bin/env node

const readline = require('readline-sync');
const fs = require("fs");
console.log("do you want to implement advance security : y/n ?");
var ans = String(readline.question());
var Radio = require('prompt-radio');
var file;
var additionalString = "";
var db = {};
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../../db/config/config.json')[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
var queryInterface = sequelize.getQueryInterface()

if (ans == 'y' || ans == 'Y') {
  console.log("do you want to use existing models ? y/n?");
  var useExisting = readline.question();
  if (useExisting == 'y' || useExisting == 'Y') {
    fs
      .readdirSync("./db/models")
      .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== "index.js") && (file.slice(-3) === '.js');
      })
      .forEach(file => {
        if (file != "product.js") {
          console.log(file);
          const model = require(path.join("../../db/models", file))(sequelize, Sequelize.DataTypes);
          db[model.name] = model;
        }
      });


    fs.readdirSync("./api").forEach(moduleName => {
      fs.readdirSync(`./api/${moduleName}`)
        .filter(file => {
          return (file.indexOf('.') !== 0) && (file !== "index.js") && (file.slice(-3) === '.js');
        })
        .forEach(file => {
          const model = require(path.join("../../api", moduleName, file))(sequelize, Sequelize.DataTypes);
          db[model.name] = model;
        });

      Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
          db[modelName].associate(db);
        }
      });
    });
    console.log("choose one model");
    console.log(Object.keys(db));
    let answer = readline.question();
    additionalString = `var modelToUse = "${answer}";`;
    if (!Object.keys(db[answer].rawAttributes).includes("refresh_token")) {
      queryInterface.addColumn(answer, 'refresh_token', {
        type: Sequelize.STRING
      });
      console.log("refresh_token  column added to ", answer, "model");
    }
    if (!Object.keys(db[answer].rawAttributes).includes("user_key")) {
      queryInterface.addColumn(answer, 'user_key', {
        type: Sequelize.STRING
      });
      console.log("user_key column added to ", answer, "model");
    }

  } else {
    console.log("using default model... User");
    additionalString = `var modelToUse = "User";`;
  }

  console.log("Do you want third party auth y/n?");
  var thirdPartyAuth = readline.question();
  if (thirdPartyAuth == 'y' || thirdPartyAuth == 'Y') {
    file = additionalString + fs.readFileSync("./bin/files/advanceThirdPartAuth.js", "utf-8");
    let pass = fs.readFileSync("./bin/files/passportSetup.js","utf-8");
    fs.writeFileSync("./core/passport-setup.js",pass);
  } else {
    file = additionalString + fs.readFileSync("./bin/files/advanceSecurity.js", "utf-8");
  }
} else {
  console.log("Do you want third party auth y/n");
  var thirdPartyAuth = readline.question();
  if (thirdPartyAuth == 'y' || thirdPartyAuth == 'Y') {
    file = fs.readFileSync("./bin/files/thirdPartAuth.js", "utf-8");
    let pass = fs.readFileSync("./bin/files/passportSetup.js","utf-8");
    fs.writeFileSync("./core/passport-setup.js",pass);
  } else {
    file = fs.readFileSync("./bin/files/basicSecurity.js", "utf-8");
  }
}
fs.writeFileSync("./core/coreRoutes.js", file);