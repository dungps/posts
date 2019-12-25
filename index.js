const program = require("commander");
const { reject, kebabCase } = require("lodash");
const { writeFileSync } = require("fs");
const { resolve, basename } = require("path");

const packageJson = require("./package.json");
const postdata = require("./posts.json");

program.Command.prototype.usage = program.usage = function() {
  program.commands = reject(program.commands, {
    _name: "*"
  });
};

program.Command.prototype.versionInfomation = program.versionInfomation = function() {
  program.emit("version");
};

program.version(packageJson.version, "-v", "--version");

program
  .command("post:make [name]")
  .description("Make a post")
  .action(name => {
    const date = new Date();

    const fileName = `${date.getDate()}${date.getMonth()}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}-${kebabCase(
      name.toLowerCase()
    )}`;

    const content = `# Sample content`;

    writeFileSync(resolve(__dirname, "contents", fileName + ".md"), content, {
      encoding: "utf8"
    });

    postdata.push({
      title: name,
      slug: fileName,
      image: "",
      date: date.getTime()
    });

    writeFileSync("posts.json", JSON.stringify(postdata, null, 2), {
      encoding: "utf8"
    });
  });

program.parse(process.argv);

const NO_COMMAND_SPECIFIED = program.args.length === 0;

if (NO_COMMAND_SPECIFIED) {
  program.help();
}
