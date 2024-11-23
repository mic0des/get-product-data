const { URL } = require("url");

const cheerio = require("cheerio");
const HttpsProxyAgent = require("https-proxy-agent");
const fetch = require("node-fetch");

module.exports = {
  name: "Sephora",
  URLs: [
    /^https:\/\/www\.sephora\.com\/p\/([a-z0-9-]*\/)?-\/A-\d*(\?.*)?$/i,
    /^https:\/\/www\.sephora\.com\/ca\/en\/product\/P\d+$/i,
    /^https:\/\/www\.sephora\.com\/ca\/en\/product\/[a-z0-9-]+-P\d+$/i,
    /^https:\/\/www\.sephora\.com\/ca\/en\/product\/P\d+\?skuId=\d+$/i,
  ],
  testCases: [
    {
      name: "Soft Matte Complete Full Coverage Longwear Concealer",
      price: "$44.00",
      image:
        "https://www.sephora.com/productimages/sku/s2371425-main-zoom.jpg?imwidth=465",
      url: "https://www.sephora.com/ca/en/product/soft-matte-complete-concealer-P416200",
    },
  ],
  async getter(url, proxy) {
    const options = {
      headers: {
        "User-Agent": "PostmanRuntime/7.28.4",
      },
    };
    if (proxy) options.agent = new HttpsProxyAgent(new URL(proxy));
    const res = await fetch(url, options);
    if (!res.ok)
      throw new Error(`Res not ok. Status: ${res.status} ${res.statusText}`);
    const html = await res.text();
    const $ = cheerio.load(html);

    const name = $('span[data-at="product_name"]').text().trim();

    let price = $('p[data-comp="Price "] span span b').text().trim();

    const image = $('link[rel="preload"]').attr("href");

    return { name, price, image };
  },
};
