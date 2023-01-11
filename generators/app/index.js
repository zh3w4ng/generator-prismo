"use strict";

var Generator = require("yeoman-generator");

module.exports = class extends Generator {
  method1() {
    this.log("method 1 just ran");
  }

  method2() {
    this.log("method 2 just ran");
  }

  async prompting() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname, // Default to current folder name
      },
      {
        type: "confirm",
        name: "cool",
        message: "Would you like to enable the Cool feature?",
      },
    ]);

    this.log("app name", answers.name);
    this.log("cool feature", answers.cool);
  }
};
