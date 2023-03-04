const app = require("./app");
const { PGPORT } = require("./config");

app.listen(PGPORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
});