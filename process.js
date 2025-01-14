const fs = require("fs");
const request = require("request");
const JSZip = require("jszip");
const path = require("path");

// Get emails
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

// Get input JSON
const input = require("./input/input.json");

const download = function (uri, filename) {
  return new Promise((resolve, reject) => {
    request.head(uri, function (err, res) {
      if (err) return reject(err);
      request(uri)
        .pipe(fs.createWriteStream(filename))
        .on("close", resolve)
        .on("error", reject);
    });
  });
};

// Process each email sequentially
const processEmails = async () => {
  for (const email in emails) {
    try {
      let temp = emails[email];
      temp = temp.replaceAll(/#c9fff7/gi, input.background);
      temp = temp.replaceAll(/#393030/gi, input.lowlight);
      temp = temp.replaceAll(/#07be00/gi, input.highlight);

      await download(input.logoUrl, `./source/${email}/images/logo.jpg`);

      switch (email) {
        case "nurture2":
          temp = temp.replace(
            "images/1712578675-4c24b22a.png",
            "images/logo.jpg"
          );
          break;
        case "nurture1":
          temp = temp.replace(
            "images/1712576772-30444fb9.png",
            "images/logo.jpg"
          );
          break;
        default:
          temp = temp.replace(
            "images/1712575426-3693fdeb.png",
            "images/logo.jpg"
          );
          break;
      }

      const zip = new JSZip();
      zip.file("template.html", temp);

      const images = fs.readdirSync(`./source/${email}/images`);
      images.forEach((image) => {
        const filePath = path.join(`./source/${email}/images`, image);
        const content = fs.readFileSync(filePath);
        zip.file(`images/${image}`, content);
      });

      const zipContent = await zip.generateAsync({ type: "nodebuffer" });
      fs.writeFileSync(`./${email}.zip`, zipContent);

      console.log(`Created ${email}.zip successfully.`);
    } catch (err) {
      console.error(`Error processing ${email}:`, err);
    }
  }
};

processEmails();
