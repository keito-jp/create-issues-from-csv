const parse = require("csv-parse/lib/sync");
const fs = require("fs");

const github = require('octonode');

const ORG_NAME = "keito-jp";
const REPO_NAME = `${ORG_NAME}/create-issues-from-csv`;

const client = github.client(process.env.GITHUB_ACCESS_TOKEN);

const ghrepo = client.repo(REPO_NAME);

const inputFileName = "issues.csv";
const file = fs.readFileSync(inputFileName);
const parsed = parse(file, {columns: true});

parsed.forEach(element => {
  ghrepo.issue({
    "title": element.title,
    "body": `
# WHAT

${element["what"] || ""}

# WHY

${element["why"] || ""}

# HOW

${element["how"] || ""}

# Conditions for Approval

${element["conditions-for-approval"] || ""}
    `,
    "labels": [element.label]
  }, (err, body, status) => {
    console.log(err);
    console.log(body);
    console.log(status);
  });
});
