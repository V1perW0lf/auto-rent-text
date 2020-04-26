const http = require("http");

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require('twilio')(accountSid, authToken);

const server = http.createServer((request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  if (request.method === "POST" && request.url === "/calc/text") {
    let body = [];
    request.on('data', (chunk) => {
      body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    const length = "Total Amount: ".length
    const chargeAmountBegInd = body.indexOf("Total Amount:") + length;
    console.log("beg ind: " + chargeAmountBegInd);
    const chargeAmountEndInd = body.indexOf("RealPage Payments Services LLC - 2201 Lakeside Blvd., Richardson, TX 75082 (855) 473-7729") - 4;
    console.log("end ind: " + chargeAmountEndInd);
    const chargeAmount = parseFloat(body.substring(chargeAmountBegInd + 1, chargeAmountEndInd).replace(",", ""));
    console.log("before parsefloat: " + body.substring(chargeAmountBegInd + 1, chargeAmountEndInd))
    console.log("after parsefloat: " + chargeAmount)
    const internetAmountPerPerson = 21;
    const petFee = 50;
    const electricityTotal = 140;
    const electricityPerPerson = electricityTotal / 2;
    const blakePayPal = (chargeAmount + electricityTotal) - (((chargeAmount - petFee) / 2) + internetAmountPerPerson + electricityPerPerson);
    console.log("blakepaypal: " + blakePayPal)
    client.messages
    .create({
      body: 'Hey Blake! This is how much you should PayPal CJ: $' + blakePayPal,
      from: process.env.twilioNumber,
      to: process.env.blakeNumber
    })
    response.write(blakePayPal.toString());
    response.end();
  })
}
});

server.listen(process.env.PORT || 5000);
