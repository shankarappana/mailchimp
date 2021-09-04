const express = require("express");
const bodyParser = require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

client.setConfig({apiKey: "8a4f5a670319610984b5c8be20cbd9b7-us7",  server: "us7",});

app.get("/", (req,res)=>{
  res.sendFile(__dirname + "/signup.html");
});

app.post("/",(req, res) => {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  }

  const run = async () => {
      const response = await client.lists.addListMember("d9a268f94a", {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
            FNAME: subscribingUser.firstName,
            LNAME: subscribingUser.lastName
        }
      });
      // console.log("status code " + res.statusCode);
      if(res.statusCode == 100){
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
};
run().catch(e => res.sendFile(__dirname + "/failure.html"));

});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, ()=>{
  console.log("Port: 3000 is started");
});

// api j=key
// 8a4f5a670319610984b5c8be20cbd9b7-us7
// list id
// d9a268f94a
