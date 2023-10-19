const { readdir } = require("node:fs/promises");
const path = require("node:path");
// const puppeteer = require("puppeteer");

const timeout = (ms) => {
 return new Promise((resolve) => setTimeout(resolve, ms));
};

const listDirectories = async (inputPath) => {
 const directories = (await readdir(inputPath, { withFileTypes: true }))
  .filter((dirent) => dirent.isDirectory())
  .filter((dir) => [".git", "node_modules"].indexOf(dir.name) < 0)
  .map((dir) => dir.name);

 return directories;
};

(async () => {
 //  // Create a browser instance
 //  const browser = await puppeteer.launch({ headless: "new" });

 //  // Create a new page
 //  const page = await browser.newPage();

 //  page
 //   .on("console", (message) =>
 //    console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`)
 //   )
 //   .on("pageerror", ({ message }) => console.log(message))
 //   .on("response", (response) =>
 //    console.log(`${response.status()} ${response.url()}`)
 //   )
 //   .on("requestfailed", (request) =>
 //    console.log(`${request.failure().errorText} ${request.url()}`)
 //   );

 //  // Set viewport width and height
 //  await page.setViewport({ width: 800, height: 600 });

 //  const website_url = "file:///C:/Users/ajayk/Projects/Code/js-playground/matrix-effect/index.html";

 //  // Open URL in current page
 //  await page.goto(website_url, { waitUntil: "networkidle0" });

 //  await timeout(3000);

 // //  console.log(await page.content());

 //  // Capture screenshot
 //  await page.screenshot({
 //   path: "./analog-clock/screenshot.jpg",
 //  });

 //  // Close the browser instance
 //  await browser.close();
 // });

 const directories = await listDirectories(__dirname);

 console.log(directories);
 console.log(path.resolve(path.join(__dirname, "analog-clock", "index.html")));
})();

// listDirectories(__dirname).then((directories) => {
//  console.log(directories);

// [
//   '.git',
//   '.vscode',
//   'controllers',
//   'node_modules',
//   'pages',
//   'routes',
//   'src',
//   'views'
// ]
