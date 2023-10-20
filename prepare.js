const { readdir, readFile, writeFile } = require("node:fs/promises");
const path = require("node:path");
const puppeteer = require("puppeteer");
const htmlCreator = require("html-creator");

const excludedDirs = [".git", "node_modules"];

const timeout = (ms) => {
 return new Promise((resolve) => setTimeout(resolve, ms));
};

const listDirectories = async (inputPath) => {
 const directories = (await readdir(inputPath, { withFileTypes: true }))
  .filter((dirent) => dirent.isDirectory())
  .filter((dir) => excludedDirs.indexOf(dir.name) < 0)
  .map((dir) => dir.name);

 return directories;
};

const loadPageAndSaveScreenshot = async (browser, project) => {
 // Create a new page
 const page = await browser.newPage();

 //   page
 //    .on("console", (message) =>
 //     console.log(
 //      `${message.type().substr(0, 3).toUpperCase()} ${message.text()}`
 //     )
 //    )
 //    .on("pageerror", ({ message }) => console.log(message))
 //    .on("response", (response) =>
 //     console.log(`${response.status()} ${response.url()}`)
 //    )
 //    .on("requestfailed", (request) =>
 //     console.log(`${request.failure().errorText} ${request.url()}`)
 //    );

 // Set viewport width and height
 await page.setViewport({ width: 800, height: 600 });

 const website_url = `file:///C:/Users/ajayk/Projects/Code/js-playground/${project}/index.html`;

 // Open URL in current page
 await page.goto(website_url, { waitUntil: "networkidle0" });

 await timeout(3000);

 //  console.log(await page.content());

 // Capture screenshot
 await page.screenshot({
  path: `./${project}/output.jpg`,
 });
};

// Main method for iteration for projects
(async () => {
 const projectDirs = await listDirectories(__dirname);

 // Create a browser instance
 const browser = await puppeteer.launch({ headless: "new" });

 const indexHTML = new htmlCreator([
  {
   type: "head",
   content: [
    {
     type: "title",
     content: "JS Playground | AJBitus",
    },
    {
     type: "link",
     attributes: { rel: "stylesheet", href: "./index.css" },
    },
    {
     type: "meta",
     attributes: {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0, user-scalable=0",
     },
    },
    {
     type: "script",
     attributes: {
      async: true,
      src: "https://www.googletagmanager.com/gtag/js?id=G-LRM107MFY2",
     },
    },
    {
     type: "script",
     content:
      "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-LRM107MFY2');",
    },
   ],
  },
  {
   type: "body",
   content: [
    { type: "header", content: [{ type: "h1", content: "JS Playground" }] },
    {
     type: "main",
     content: [
      {
       type: "div",
       attributes: { class: "projects" },
      },
     ],
    },
    {
     type: "footer",
     content: [{ type: "h4", content: `By @ajbitus` }],
    },
   ],
  },
 ]);

 let readmeFile =
   "# JS Playground\n## By [@ajbitus](https://github.com/ajbitus)\n",
  projectIndex = 0;

 for await (const project of projectDirs) {
  await loadPageAndSaveScreenshot(browser, project);

  const sourceLink = await readFile(path.join(__dirname, project, "LINK"));

  indexHTML.document.addElementToClass("projects", {
   type: "div",
   attributes: { id: `project-${project}`, class: "project" },
   content: [
    {
     type: "a",
     attributes: { href: `./${project}/`, class: "project-img-link" },
     content: [
      {
       type: "img",
       attributes: {
        src: `./${project}/output.jpg`,
        alt: project,
        class: "project-img",
       },
      },
     ],
    },
   ],
  });

  indexHTML.document.addElementToId(`project-${project}`, {
   type: "a",
   attributes: { href: `./${project}/`, class: "project-title-link" },
   content: [
    {
     type: "h3",
     attributes: { class: "project-title" },
     content: project,
    },
   ],
  });

  indexHTML.document.addElementToId(`project-${project}`, {
   type: "a",
   attributes: {
    href: sourceLink,
    target: "_blank",
    class: "project-ext-link",
   },
   content: [
    {
     type: "h4",
     attributes: { id: `project-${project}-ext-link`, class: "project-ext" },
     content: `🔗 ${sourceLink}`,
    },
   ],
  });

  readmeFile += `### ${
   projectIndex + 1
  } - ${project} (Source: 🔗[${sourceLink}](${sourceLink}))\n![${project}](./${project}/output.jpg "${project}")\n`;

  projectIndex++;
 }

 await indexHTML.renderHTMLToFile(path.join(__dirname, "index.html"), {
  htmlTagAttributes: {
   lang: "en",
  },
 });

 await writeFile("./README.md", readmeFile);

 // Close the browser instance
 await browser.close();
})();
