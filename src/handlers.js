exports.home = function (req, res) {
  res.send("<h1>Hello</h1>");
};

exports.missing = function (req, res) {
  res.status(404).send("<h1>Not found</h1>");
};
