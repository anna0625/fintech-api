const PORT = 8000;

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const searchWebsite = [
  {
    name: "builtin",
    url: "https://builtin.com/fintech/fintech-companies-startups-to-know",
    html_attr: ".info .title a",
    html_title: "",
    html_url: "",
  },
  //   {
  //     name: "fintech.coffee",
  //     url: "https://www.fintech.coffee/research/australia",
  //     html_attr: ".rich-text-block-2",
  //     html_title: "h2",
  //     html_url: "p a",
  //   },
  {
    name: "explodingtopics",
    url: "https://explodingtopics.com/blog/fintech-startups",
    html_attr: ".paragraph h3",
    html_title: "split",
    html_url: "p a",
  },
];

const companies = [];

searchWebsite.forEach((website) => {
  axios.get(website.url).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    $(website.html_attr).each(function () {
      const title =
        website.html_title !== ""
          ? $(this).text().split(" ")[1]
          : $(this).text();
      const url =
        website.html_url !== ""
          ? $(this)
              .next()
              .next()
              .next()
              .next()
              .next()
              .next()
              .next()
              .children("a")
              .attr("href")
          : $(this).attr("href");
      companies.push({
        title,
        url,
        source: website.name,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Welcome to fintech company API");
});

app.get("/company", (req, res) => {
  res.json(companies);
});

// app.get("/company/:websiteId", async (req, res) => {
//   const websiteId = req.params.websiteId;

//   const websiteUrl = searchWebsite.filter(
//     (website) => website.name === websiteId
//   )[0].url;

//     axios.get(websiteUrl).then(response => {
//         const html = response.data
//         const $ = cheerio.load(html)

//         const specificCompany = []

//     })
// });

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
