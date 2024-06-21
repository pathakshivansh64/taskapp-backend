const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");

//for creating user at /api/createuser

const JWT_secret="shivansh is $ good m$n";

router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must contain at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    
    //if there exists a error then it will show by going in if condition
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    
    const salt=await bcrypt.genSalt(10);
    const secpass=  bcrypt.hashSync(req.body.password, salt);
    
    try {
      let user = await User.findOne({ email: req.body.email });
      
      if (user) {
       
        return  res.status(400).json({success, error: "sorry an email with this username alredy exists" });
      }

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secpass,
      });

      const data={
        user:{
            id:user.id        }
      }

      const authtoken=jwt.sign(data,JWT_secret);
    //  console.log(jwtData);
     success=true;
      res.json({success,authtoken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
    /*then(user=>res.json(user)).catch((err)=>{console.log(err)
    res.json({error:"please enter a valid and unique value for email"})
    })*/

    /* console.log(req.body);
    const user=User(req.body);
    //user.save();*/
    //res.send(req.body);
  }
);

//for creating user at /api/login
router.post(
    "/login",
    [
      body("email", "Enter a valid email").isEmail(),
      body("password", "Password should not be empty").exists()
    ],
    async (req, res) => {
      let success=false;
      const errors = validationResult(req);
      //if there exists a error then it will show by going in if condition
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()});
      }


      const {email,password}=req.body;
     try {
        let user=await User.findOne({email});
        if(!user){
            return res.status(500).json({success,error:"Please try to login with correct credentials "});

        }

        const passcom=await bcrypt.compare(password,user.password);
        if(!passcom){
            return res.status(500).json({success,error:"Please try to login with correct credentials "});
        }
        const data={
            user:{
                id:user.id        }
          }
         
          const authtoken=jwt.sign(data,JWT_secret);
        //  console.log(jwtData);
         success=true;
          res.json({success,authtoken});
        } catch (error) {
          console.error(error.message);
          res.status(500).send("Internal Server Error");
        }


   


    }

    
)   

//for creating user at /api/getuser
router.post(
    "/getuser",fetchuser,async (req, res) => {
    
    try {
         userid=req.user.id;

         const user=await User.findById(userid).select("-password");
         res.send(user);

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }


    }
)


module.exports = router;
