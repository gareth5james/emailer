//tools

const fs = require("fs");
const cheerio = require("cheerio");
const request = require("request");
const JSZip = require("jszip");
const path = require("path");

//get emails
const abandoned = fs.readFileSync(
  "./source/Abandoned Browser/template.html",
  "utf-8"
);
const anniversary = fs.readFileSync(
  "./source/AnniversaryBirthday Email/template.html",
  "utf-8"
);
const blog = fs.readFileSync("./source/Blog Email/template.html", "utf-8");
const confirmation1 = fs.readFileSync(
  "./source/Confirmation Email 1/template.html",
  "utf-8"
);
const confirmation2 = fs.readFileSync(
  "./source/Confirmation Email 2/template.html",
  "utf-8"
);
const event = fs.readFileSync("./source/Event Email/template.html", "utf-8");
const nps1 = fs.readFileSync(
  "./source/NPS Review Email 1/template.html",
  "utf-8"
);
const nps2 = fs.readFileSync(
  "./source/NPS Review Email 2/template.html",
  "utf-8"
);
const nurture1 = fs.readFileSync(
  "./source/Nurture Campaign 1/template.html",
  "utf-8"
);
const nurture2 = fs.readFileSync(
  "./source/Nurture Campaign 2/template.html",
  "utf-8"
);
const prompt = fs.readFileSync(
  "./source/Profile Prompt Email/template.html",
  "utf-8"
);
const testimonial = fs.readFileSync(
  "./source/Testimonial Email/template.html",
  "utf-8"
);
const webinar1 = fs.readFileSync(
  "./source/Webinar Invite Email 1/template.html",
  "utf-8"
);
const webinar2 = fs.readFileSync(
  "./source/Webinar Invite Email 2/template.html",
  "utf-8"
);

const emails = {
  abandoned,
  anniversary,
  blog,
  confirmation1,
  confirmation2,
  event,
  nps1,
  nps2,
  nurture1,
  nurture2,
  prompt,
  testimonial,
  webinar1,
  webinar2,
};

//get input json

const input = require("./input/input.json");

//loop through and amend

for (email in emails) {
  let temp = emails[email];

  temp = temp.replaceAll(/#c9fff7/gi, input.background);
  temp = temp.replaceAll(/#393030/gi, input.lowlight);
  temp = temp.replaceAll(/#07be00/gi, input.highlight);

  const download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
      console.log("content-type:", res.headers["content-type"]);
      console.log("content-length:", res.headers["content-length"]);

      request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
    });
  };

  download(input.logoUrl, `./output/${email}/images/logo.jpg`, () => {});
}
