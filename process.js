//tools

const fs = require("fs");
//const cheerio = require("cheerio");
const request = require("request");
const JSZip = require("jszip");
const path = require("path");

//get emails
const abandoned = fs.readFileSync("./source/abandoned/template.html", "utf-8");
const anniversary = fs.readFileSync(
  "./source/anniversary/template.html",
  "utf-8"
);
const blog = fs.readFileSync("./source/blog/template.html", "utf-8");
const confirmation1 = fs.readFileSync(
  "./source/confirmation1/template.html",
  "utf-8"
);
const confirmation2 = fs.readFileSync(
  "./source/confirmation2/template.html",
  "utf-8"
);
const event = fs.readFileSync("./source/event/template.html", "utf-8");
const nps1 = fs.readFileSync("./source/nps1/template.html", "utf-8");
const nps2 = fs.readFileSync("./source/nps2/template.html", "utf-8");
const nurture1 = fs.readFileSync("./source/nurture1/template.html", "utf-8");
const nurture2 = fs.readFileSync("./source/nurture2/template.html", "utf-8");
const prompt = fs.readFileSync("./source/prompt/template.html", "utf-8");
const testimonial = fs.readFileSync(
  "./source/testimonial/template.html",
  "utf-8"
);
const webinar1 = fs.readFileSync("./source/webinar1/template.html", "utf-8");
const webinar2 = fs.readFileSync("./source/webinar2/template.html", "utf-8");

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

const zipper = {}

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

  download(input.logoUrl, `./source/${email}/images/logo.jpg`, () => {});

  switch (email) {
    case "nurture2":
      temp = temp.replace("images/1712578675-4c24b22a.png", "images/logo.jpg");
      break;
    case "nurture1":
      temp = temp.replace("images/1712576772-30444fb9.png", "images/logo.jpg");
      break;
    default:
      temp = temp.replace("images/1712575426-3693fdeb.png", "images/logo.jpg");
      break;
  }

  //zip

  zipper[`${email}`] = new JSZip();

  zipper[`${email}`].file("template.html", temp);

  const images = fs.readdirSync(`./source/${email}/images`);

  images.forEach((image) => {
    const filePath = path.join(`./source/${email}/images`, image);
    const content = fs.readFileSync(filePath);
    zipper[`${email}`].file(`images/${image}`, content);
  });

  zipper[`${email}`]
  .generateAsync({ type: "nodebuffer" })
  .then((content) => {
    fs.writeFileSync(`./${email}.zip`, content);
  })
  .catch((err) => {
    console.error("Error creating zip file:", err);
  });
}
