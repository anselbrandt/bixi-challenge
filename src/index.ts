import express from "express";
import http from "http";
const path = require("path");
import * as dotenv from "dotenv";
dotenv.config();
const fs = require("fs").promises;
const papa = require("papaparse");

const PORT = process.env.PORT || 4000;

const main = async () => {
  const file = await fs.readFile("./dist/Stations_2019.csv", "utf-8");
  const raw = papa.parse(file).data;
  const data = raw
    .filter((_: any, index: any) => index !== 0)
    .map((val: any) => {
      return {
        code: val[0],
        name: val[1],
        lat: val[2],
        long: val[3],
      };
    })
    .filter((val: any) => !isNaN(val.code))
    .filter((val: any) => typeof val.name !== "undefined");
  const sortedByCode = [...data].sort(
    (a: any, b: any) => parseFloat(a.code) - parseFloat(b.code)
  );
  const sortedByName = [...data].sort((a: any, b: any) => {
    if (a.name > b.name) {
      return -1;
    }
    if (b.name > a.name) {
      return 1;
    }
    return 0;
  });

  const app = express();

  app.use(express.static(path.join(__dirname, "../web/build")));

  app.get("/", (_, res) => {
    res.sendFile(path.join(__dirname + "../web/build/index.html"));
  });

  app.get("/api", (req, res) => {
    const query = req.query.sortby;
    switch (query) {
      case "code":
        res.send(JSON.stringify(sortedByCode));
        break;
      case "name":
        res.send(JSON.stringify(sortedByName));
        break;
      default:
        res.send(JSON.stringify(sortedByCode));
    }
  });

  const httpServer = http.createServer(app);

  httpServer.listen(PORT, () => {
    console.log(`server started on http://localhost:${PORT}`);
  });
};

main().catch((error) => {
  console.error(error);
});
