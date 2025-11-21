import twilio from 'twilio';

const sendWhatsAppMsg = async (to) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    const client = twilio(accountSid, authToken);

    client.messages
        .create({
            from: 'whatsapp:+14155238886',
            body: 'Hello from PrintZet!',
            to: `whatsapp:+91${to}`
        })
        .then(message => console.log(message.sid))
        .catch(error => console.error("Error sending WhatsApp message:", error));
}

export default sendWhatsAppMsg;