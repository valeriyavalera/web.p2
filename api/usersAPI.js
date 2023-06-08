const { Router } = require('express');
const { Users } = require('./models/users')
const { v4: uuidv4 } = require('uuid');

const router = new Router();
const uniqueApiKey = uuidv4();

router.post("/users", async (req, res) => {
    const { email, password, apiKey = uniqueApiKey } = req.body;
    try {
     const user = new Users({ email, password, apiKey });
     
     const userEmail = await Users.findOne({email});

     if(userEmail){
        return res.status(400).send({message: 'This email is already in use '});
     }
     if(!email){
        return res.status(400).send({message: 'email is required!'});
     }
     if(!password){
        return res.status(400).send({message: 'password is required!'});
     }
     const doc = await user.save();

     return res.status(200).send(doc);
   }
   catch (error) {
        res.status(400).send({ message: error.message })}
});

router.post("/users/login", async (req, res) => {
   const { email, password } = req.body;
   const user = await Users.findOne({ email, password });

   if (!user) {
      return res.status(400).json({ message: 'User with such credentials was not found' });
   }
   res.status(200).send(user);
});

module.exports = { router };