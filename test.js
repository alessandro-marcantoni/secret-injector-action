const { readFileSync } = require("fs");

const read = (path) => JSON.parse(readFileSync(path));

const asserEquals = (expected, actual) => {
  if (expected !== actual) {
    throw new Error("Expected " + expected + " but got " + actual);
  }
};

const secrets = JSON.parse(process.env.secrets);
const env = JSON.parse(process.env.env);
const fileContent = read("test-file.json");

asserEquals(env["foo"], fileContent["foo"]);
asserEquals(env["bar"], fileContent["bar"]);
asserEquals(secrets["BAZ"], fileContent["baz"]);
