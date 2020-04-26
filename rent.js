const http = require("http");
const port = 6969;
const hostname = "http://localhost";

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
    const chargeAmountEndInd = body.indexOf("RealPage Payments Services LLC - 2201 Lakeside Blvd., Richardson, TX 75082 (855) 473-7729") - 4;
    const electricityTotal = 140;
    const chargeAmount = parseFloat(body.substring(chargeAmountBegInd + 1, chargeAmountEndInd).replace(",", ""));
    const internetAmountPerPerson = 21;
    const petFee = 50;
    const electricityPerPerson = 70;
    const blakePayPal = (chargeAmount + electricityTotal) - (((chargeAmount - petFee) / 2) + internetAmountPerPerson + electricityPerPerson);
    client.messages
    .create({
      body: 'Hey Blake! This is how much you should PayPal CJ: $' + blakePayPal,
      from: '+13344633501',
      to: '+19369000356'
    })
    response.write(blakePayPal.toString());
    response.end();
  })
}
});

server.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
