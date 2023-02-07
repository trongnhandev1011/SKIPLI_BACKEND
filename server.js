const express = require("express");
const cors = require("cors");
const { createNewAccessCode, validateAccessCode } = require("./service/phone");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/createNewAccessCode", createNewAccessCode);

app.post("/validateAccessCode", validateAccessCode);

app.listen(4000, () => console.log("Up & Running *4000"));
