const keyPublishable = "pk_test_6pRNASCoBOKtIshFeQd4XMUh"; // or const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = "sk_test_BQokikJOvBiI2HlWgH4olfQ2"; // or const keySecret = process.env.SECRET_KEY;

const app = require("express")();
const stripe = require("stripe")(keySecret);

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var hiddenAmount;

app.get("/", (req, res) =>
  res.render("index.pug"));

app.post("/pay", (req, res) => {
  hiddenAmount = req.body.my_amount;
  res.render("pay.pug", {keyPublishable, hiddenAmount});
});

app.post("/charge", (req, res) => {
  let amount = hiddenAmount * 100;

  stripe.customers.create({
     email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "Sample Charge",
         currency: "EUR",
         customer: customer.id
    }))
  .then(charge => res.render("charge.pug", {my_amount}));
});

app.listen(80);


