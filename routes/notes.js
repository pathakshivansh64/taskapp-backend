const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
const { findByIdAndUpdate } = require("../models/User");

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  const notes = await Notes.find({ user: req.user.id });

  res.json(notes);
});

router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "Enter a valid title of atleast 3 characters").isLength({
      min: 3,
    }),

    body(
      "description",
      "description must contain at least 5 characters"
    ).isLength({
      min: 2,
    }),
  ],
  async (req, res) => {
   //console.log("hi im addnote");
    const errors = validationResult(req);
   // console.log(errors);
    //if there exists a error then it will show by going in if condition
    if (!errors.isEmpty()) {
     // console.log("hi im  error in addnote");
      return res.status(400).json({ errors: errors.array() });
    }
    try {
     // console.log("hi im answer addnote");
    
    const {title,description,tag}=req.body;

    const note=new Notes({
        title,description,tag,user:req.user.id
    })
    const savednote= await note.save();

    res.json(savednote)
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }


  }
);

router.put("/updatenotes/:id", fetchuser, async (req, res) => {
  
  try {
    
  

    const {title,description,tag}=req.body;

  const newnote={};
  if(title){newnote.title=title}
  if(description){newnote.description=description}
  if(tag){newnote.tag=tag};

  let note=await Notes.findById(req.params.id)
  if(!note){
    return res.status(404).send("User not found")
  }

  if(note.user.toString()!=req.user.id)
  return res.status(404).send("User not found")

  note=await Notes.findByIdAndUpdate(req.params.id,{$set:newnote},{new:true})
  res.json(note)

} catch (error) {
  res.status(500).send("Internal Server Error");
}



})

router.delete("/deletenotes/:id", fetchuser, async (req, res) => {

  try {
    
  

let note=await Notes.findById(req.params.id)
if(!note){
  return res.status(404).send("User not found")
}

if(note.user.toString()!=req.user.id)
return res.status(404).send("User not found")

note=await Notes.findByIdAndDelete(req.params.id)
res.json({"Success": "your note has been deleted",note:note})

} catch (error) {
  res.status(500).send("Internal Server Error");  
}

})




module.exports = router;
