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
      const length = '<td>Total Amount:</td><td style="color:#616161">$'.length
      const chargeAmountBegInd = body.indexOf('<td>Total Amount:</td><td style="color:#616161">$') + length;
      const chargeAmountEndInd = chargeAmountBegInd + 4;
      const chargeAmount = body.substring(chargeAmountBegInd + 1, chargeAmountEndInd).replace(",", "");
      const internetAmountPerPerson = 21;
      const petFee = 50;
      const electricityTotal = parseFloat(process.env.electricity);
      const electricityPerPerson = electricityTotal / 2;
      const blakePayPal = ((chargeAmount + electricityTotal) - (((chargeAmount - petFee) / 2) + internetAmountPerPerson + electricityPerPerson)).toFixed(2);
      client.messages
      .create({
        body: 'Hey Blake! This is how much you should PayPal CJ: $' + chargeAmountBegInd + " " + chargeAmountEndInd + ", chargeAmount: " + chargeAmount + ", blakePayPal:  " + blakePayPal,
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
