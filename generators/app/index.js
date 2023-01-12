"use strict";

import Generator from "yeoman-generator";
import chalk from "chalk";
import yosay from "yosay";

const version = "1.0.0";
const _defaultProjectName = "primso-app";
const _defaultProjectType = "flink";

const _replaceSpacesWithDash = (input) =>
  (input || _defaultProjectName).trim().replace(/\./g, "_").replace(/\W+/g, "-");

export default class PrismoGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.projectTypes = ["flink"];

    this.props = {
      projectDirectory: _defaultProjectName,
      projectType: _defaultProjectType,
    };

    this.option("name", {
      alias: "n",
      hide: false,
      type: String,
      required: false,
      desc: `Name of project directory / application name.
                        # Will be prompted if no values was specify.
                        # Non alphanumeric symbols of project directory will be replaced with hyphen.`,
      default: undefined,
    });

    this.option("type", {
      alias: "t",
      hide: false,
      type: String,
      required: false,
      desc:
        `Project type.
                        # Will be prompted if no values was specify.
                        # Possible values are:
               ` + this.projectTypes.join(`\n               `),
      default: undefined,
    });

    this.prompts = [];

    const name = this.options["name"];
    const type = this.options["type"];
    const typeOptionFound = !!type && this.projectTypes.indexOf(type.trim().toLowerCase()) !== -1;

    if (typeOptionFound) this.props.projectType = type;
    else
      this.prompts.push({
        type: "list",
        name: "projectType",
        message: "What kind of project do you wanna build today, my friend?",
        choices: this.projectTypes,
        default: _defaultProjectType,
      });

    if (name) this.props.projectDirectory = name;
    else if (typeOptionFound) this.props.projectDirectory = _defaultProjectName;
    else
      this.prompts.push({
        type: "input",
        name: "projectDirectory",
        message: "Enter application project directory name",
        default: _defaultProjectName,
      });
  }

  // method1() {
  //   this.log("method 1 just ran");
  // }

  // method2() {
  //   this.log("method 2 just ran");
  // }

  prompting() {
    const generatorName = chalk.red("jvm");
    const generatorVersion = chalk.blue("v" + version);

    this.log(yosay(`Welcome to the terrific ${generatorName} generator ${generatorVersion}`));

    return this.prompt(this.prompts).then((props) => {
      this.props = Object.assign({}, this.props, props);
    });
  }

  writing() {
    /* safety */
    this.props.projectDirectory = _replaceSpacesWithDash(this.props.projectDirectory);
    this.props.projectType = this.props.projectType.trim().toLowerCase();

    /* RAW files. Using: copy functionality as is */
    this._copyCommons();
    this._copyDottedFilesAndFolders();
  }

  _copyCommons() {
    /* copy commons */
    ["gradle", "gradlew", "gradlew.bat"].forEach((suffix) =>
      this.fs.copy(
        this.templatePath(`_common/${suffix}`),
        this.destinationPath(`${this.props.projectDirectory}/${suffix}`)
      )
    );
  }

  _copyDottedFilesAndFolders() {
    ["gitignore"].forEach((suffix) =>
      this.fs.copy(
        this.templatePath(`_dotted/${suffix}`),
        this.destinationPath(`${this.props.projectDirectory}/.${suffix}`)
      )
    );
  }

  install() {
    this.log(`\nDone!`);
    this.log(`Project ${this.props.projectType} located in ./${this.props.projectDirectory}`);
    this.log(`Let's start hacking! ^_^`);
  }

  // async prompting() {
  //   const answers = await this.prompt([
  //     {
  //       type: "input",
  //       name: "name",
  //       message: "Your project name",
  //       default: this.appname, // Default to current folder name
  //     },
  //     {
  //       type: "confirm",
  //       name: "cool",
  //       message: "Would you like to enable the Cool feature?",
  //     },
  //   ]);

  //   this.log("app name", answers.name);
  //   this.log("cool feature", answers.cool);
  // }
}
