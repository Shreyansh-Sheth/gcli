#!usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import { exec } from "child_process";
const typeChoices = ["Commit", "Branch", "Undo Commit"];
const commitChoices = [
  "Bug-Fix",
  "Feature",
  "Documentation",
  "Style",
  "Refactor",
  "Test",
  "Chore",
  "Other",
];

const askType = async () => {
  const ans = await inquirer.prompt({
    name: "type",
    choices: typeChoices,
    message: "What would you like to do?",
    type: "list",
  });
  return ans;
};

const CommitPrompts = async () => {
  let commitAns =
    (
      await inquirer.prompt({
        name: "commit",
        choices: commitChoices,
        message: "What type of commit?",
        type: "list",
      })
    ).commit + "/";
  if (commitAns === "Other/") {
    commitAns = "";
  }

  const message = (
    await inquirer.prompt({
      name: "message",
      message: "What is the commit message?",
      type: "input",
    })
  ).message;

  const commitMessage = commitAns + message;
  const done = (
    await inquirer.prompt({
      name: "stage",
      message: chalk.bgRed("Have You Stage All Changes?"),
      type: "confirm",
    })
  ).stage;
  if (done) {
    exec(`git commit -m "${commitMessage}"`);
  }
};
const undoPrompt = async () => {
  const ans = (
    await inquirer.prompt({
      name: "undo",
      message: "Would you like to undo the last commit?",
      type: "confirm",
    })
  ).undo;
  if (ans) {
    exec("git reset --hard HEAD~1");
  }
};

async function main() {
  const ans = (await askType()).type;
  switch (ans) {
    case typeChoices[0]:
      await CommitPrompts();
      break;
    case typeChoices[1]:
      chalk.bgCyan("This Feature Is Under development");
      break;
    case typeChoices[2]:
      await undoPrompt();
      break;
  }
}

main();
