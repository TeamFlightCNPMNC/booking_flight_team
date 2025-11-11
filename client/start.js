const { exec } = require("child_process");
//
const child = exec(
  "npx react-scripts start",
  { stdio: "inherit" },
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Exec error: ${error.message}`);
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Stdout: ${stdout}`);
  }
);

child.on("error", (err) => {
  console.error(`Child process error: ${err.message}`);
});

child.on("exit", (code) => {
  console.log(`Child process exited with code ${code}`);
});
