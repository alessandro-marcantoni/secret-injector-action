const core = require("@actions/core");
const { isText } = require("istextorbinary");
const { readdirSync, readFileSync, writeFileSync } = require("fs");

const load = (key) => {
  try {
    const str = core.getInput(key);
    if (str === "undefined") {
      return undefined;
    }
    return JSON.parse(str);
  } catch (err) {
    const cleanError =
      err.message.substr(0, "Unexpected token ".length) +
      err.message.substr(err.message.indexOf("in JSON"));
    throw new Error(`${err} while parsing ${key}`);
  }
};

const injector = (secrets, env) => (string) => {
  if (secrets !== undefined) {
    Object.keys(secrets).forEach((key) => {
      string = string.replace(
        new RegExp("\\$\\{\\{\\s*secrets\\." + key + "\\s*\\}\\}", "gi"),
        secrets[key],
      );
    });
  }
  if (env !== undefined) {
    Object.keys(env).forEach((key) => {
      string = string.replace(
        new RegExp("\\$\\{\\{\\s*env\\." + key + "\\s*\\}\\}", "gi"),
        env[key],
      );
    });
  }
  return string;
};

const traverse = (dir, injector) => {
  readdirSync(dir, { withFileTypes: true }).forEach((file) => {
    const fileName = `${dir}${file.name}`;
    if (file.isDirectory()) {
      traverse(`${fileName}/`, injector);
    } else if (file.isFile() && isText(fileName)) {
      writeFileSync(fileName, injector(readFileSync(fileName).toString()));
    }
  });
};

try {
  const secrets = load("secrets");
  const env = load("env");

  traverse("./", injector(secrets, env));
} catch (error) {
  core.setFailed(error.message);
}
