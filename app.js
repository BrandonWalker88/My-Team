const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const Employee = require("./lib/Employee");

const teamArray = [];
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
const questionsArray = [
  {
    type: "list",
    name: "role",
    message: "What is your role",
    choices: ["Manger", "Engineer", "intern"],
  },
  {
    type: "input",
    name: "name",
    message: "What is your name",
  },

  {
    type: "input",
    name: "id",
    message: "What is your employee id?",
  },
  {
    type: "input",
    name: "email",
    message: "What is your employee email?",
    validate: function (input) {
      const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

      if (emailRegexp.test(input)) {
        return true;
      } else {
        return "Please use a valid email";
      }
    },
  },
  {
    type: "input",
    name: "github",
    message: "What is your github username",
    when: function (value) {
      if (value.role === "Engineer") {
        return true;
      } else {
        return false;
      }
    },
  },
  {
    type: "input",
    name: "school",
    message: "What school do you attend",
    when: function (value) {
      if (value.role === "intern") {
        return true;
      } else {
        return false;
      }
    },
  },
  {
    type: "input",
    name: "officenumber",
    message: "What is your office number",
    when: function (value) {
      if (value.role === "Manager") {
        return true;
      } else {
        return false;
      }
    },
  },
];

function buildTeam() {
  inquirer.prompt(questionsArray).then(function (answers) {
    if (answers.role === "Manager") {
      const teamMember = new Manager(
        answers.name,
        answers.id,
        answers.email,
        answers.officenumber
      );
      teamArray.push(teamMember);
    } else if (answers.role === "intern") {
      const teamMember = new Intern(
        answers.name,
        answers.id,
        answers.email,
        answers.school
      );
      teamArray.push(teamMember);
    } else {
      const teamMember = new Engineer(
        answers.name,
        answers.id,
        answers.email,
        answers.github
      );
      teamArray.push(teamMember);
    }
    inquirer
      .prompt({
        type: "confirm",
        message: "Would you like to add another team member?",
        name: "addAnother",
      })
      .then(function (ans) {
        ///recall buildTeam or call render method
        if (ans.addAnother) {
          buildTeam();
        } else {
          const htmlStr = render(teamArray);
          const dir = "./output";

          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
          fs.writeFile(outputPath, htmlStr, function (err, data) {
            if (err) {
              throw err;
            }
            console.log("Success");
          });
        }
      });
  });
}

buildTeam();
