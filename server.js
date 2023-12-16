const app = require("./app");
const { PGPORT } = require("./config");

app.listen(5432, function () {
  console.log(`Started on http://localhost:3001`);
});