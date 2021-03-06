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
      const length = 'Total Amount:'.length
      const chargeAmountBegInd = body.indexOf('Total Amount:') + 53 //For putsmail, 51 works perfectly
      const chargeAmountEndInd = chargeAmountBegInd + 8; //For putsmail, 8 works perfectly
      const chargeAmount = body.substring(chargeAmountBegInd + 1, chargeAmountEndInd).replace(",", ""); //parseFloat()
      const chargeAmount2 = parseFloat(body.substring(chargeAmountBegInd + 1, chargeAmountEndInd).replace(",", ""));
      const internetAmountPerPerson = 21;
      const petFee = 25;
      const electricityTotal = parseFloat(process.env.electricity);
      const electricityPerPerson = electricityTotal / 2;
      const blakePayPal = ((chargeAmount2 + electricityTotal) - (((chargeAmount - petFee) / 2) + internetAmountPerPerson + electricityPerPerson)).toFixed(2);
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
  if (request.method === "POST" && request.url === "/calc/electricity") {
    let body = [];
    request.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      process.env.electricity = body;
      response.write("Electricity has been changed to " + body);
      response.end();
    })
  }
});

server.listen(process.env.PORT || 5000);
