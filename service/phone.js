const db = require("../firebase.config");
const twilioClient = require("../twilio.config");
const generateAccessCode = require("../utils");

const createNewAccessCode = async (req, res) => {
  const code = generateAccessCode();
  const data = req;
  let returnMsg = "";
  let statusCode = 200;

  try {
    if (!data.body.phoneNumber) {
      statusCode = 400;
      returnMsg = "created_failed";
    } else {
      const result = await db
        .collection("phones")
        .doc(data.body.phoneNumber)
        .set({ code: code, isValidated: false });
      returnMsg = "created_success";
    }
  } catch (e) {
    statusCode = 500;
    returnMsg = "server_error";
  }

  twilioClient.messages.create({
    body: "Here is your new access code: " + code,
    to: data.body.phoneNumber, // Text this number
    from: "+19135132810", // From a valid Twilio number
  });

  res.status(statusCode).send({ msg: returnMsg });
};

const validateAccessCode = async (req, res) => {
  const data = req;
  let msg = "";
  let statusCode = 200;
  const phoneRef = db.collection("phones").doc(data.body.phoneNumber);
  try {
    const doc = await phoneRef.get();
    console.log(doc.data()?.code);
    if (doc.data()?.code.toString() === data.body?.accessCode) {
      const result = await phoneRef.update({ isValidated: true });
      msg = "validated_success";
    } else {
      msg = "validated_failed";
      statusCode = 400;
    }
  } catch (e) {
    msg = "server_error";
    statusCode = 500;
  }

  res.status(statusCode).send({ msg: msg });
};

module.exports = { createNewAccessCode, validateAccessCode };
