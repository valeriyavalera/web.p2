const {Router} = require('express')
const {Links} = require('./models/links');
const { Users } = require('./models/users')


const router = Router();

router.use('/links', async (req, res, next) => {
  const apiKey = req.header();
  const user = await Users.findOne({ apiKey: apiKey });
  if (!user) {
    res.status(401).send({ message: 'User is not authorized' });
  }
  next();
});

router.post('/links', async (req, res) => {

   const { original } = req.body;

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let cutLink = '';

  for (let i = 0; i < 15; i++) {
    cutLink += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  const currentDate = new Date();
  const expiredAtDate = currentDate.setDate(currentDate.getDate() + 5);

  const elem = new Links({
    'original.link': original,
    'cut': cutLink,
    expiredAt: expiredAtDate
  });

  const { link: { cut }, expiredAt } = await elem.save()
    .catch((error) => {
      if (error.code == 11000) {
        res.status(400).json({ message: 'This link is already in use' });
      };
    });

  res.status(200).send({
    link: cut,
    expiredAt: expiredAt
  });
});

router.get('/links', async (req, res) => {
  const { gt, lt } = req.query;

  if (!gt || !lt) {
    return res.status(400).json({ message: 'Both gt and lt parameters are required' });
  }

  const parsedGt = new Date(gt);
  const parsedLt = new Date(lt);

  try {
    const links = await Link.find({
      expiredAt: { $gt: parsedGt, $lt: parsedLt },
    });

    res.status(200).send(links);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get("/shortLink/:cut", (req, res) => {
  const { cut } = req.params;
  const paramsDb = {};
  if (cut) {
    paramsDb["link.cut"] = cut;
  }
  Links.findOne(paramsDb, function (err, link) {
    if (err) {
      return res.status(400).send({ message: "Error" });
    }
    if (!link) {
      return res.status(400).send({ message: "Short link was not found" });
    }
    if (link.expiredAt < Date.now()) {
      return res.status(400).send({ message: "Link was expired" });
    }
    res.redirect(link.link.original);
  });
});

module.exports = {router}
   