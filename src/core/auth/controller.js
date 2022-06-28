const router = require("express").Router();
const { passwordIsMatch, getLoggedIn, createNewUser } = require("./service");
const auth = require("./auth");

// @route      GET api/user/auth
// @desc       Get logged in user
// @access     Private
router.get("/", auth(), async (req, res) => {
  let result = await getLoggedIn(req.user.id);
  res.json(result);
});

// @route      POST api/user/auth
// @desc       Auth user & get token
// @access     Public
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  let result = await passwordIsMatch(email, password);
  res.json(result);
});

// @route      POST api/user/register
// @desc       Register New User
// @access     Private and only Admin role
router.post("/register", auth(), async (req, res) => {
  const createdId = req.user.id;
  const { name, username, password, role } = req.body;

  let result = await createNewUser(createdId, username, password, name, role);
  res.json(result);
});

module.exports = router;
