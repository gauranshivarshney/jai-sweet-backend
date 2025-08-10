import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import dotenv from 'dotenv';

dotenv.config();

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

export const sendOrderEmail = async (order) => {
  try {
    const { _id, name, phone, address, amount, products, email } = order;

    const sentFrom = new Sender(process.env.MAILERSEND_FROM_EMAIL, "Gauranshi Jai Sweet");

    const adminRecipients = [new Recipient(process.env.ADMIN_EMAIL, "Admin")];

    const adminEmailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(adminRecipients)
      .setSubject("New Order Received")
      .setHtml(`
        <h1>New Order Received</h1>
        <p><strong>Order ID:</strong> ${_id}</p>
        <p><strong>Customer Name:</strong> ${name}</p>
        <p><strong>Contact:</strong> ${phone}</p>
        <p><strong>Shipping Address:</strong> ${address}</p>
        <p><strong>Order Amount:</strong> ₹${amount}</p>
        <h2>Order Details:</h2>
        <ul>
          ${products.map(p => `<li>${p.name} - ${p.weight} - ${p.quantity} item(s) - ₹${p.price}</li>`).join('')}
        </ul>
        <p><strong>Total Amount:</strong> ₹${amount}</p>
      `)
      .setText(`
        New Order Received
        Order ID: ${_id}
        Customer: ${name}
        Contact: ${phone}
        Address: ${address}
        Amount: ₹${amount}
        
        Order Details:
        ${products.map(p => `${p.name} - ${p.weight} - ${p.quantity} item(s) - ₹${p.price}`).join('\n')}
        
        Total Amount: ₹${amount}
      `);

    if(email){
      const customerRecipients = [new Recipient(email, name)];
      const customerEmailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(customerRecipients)
        .setSubject("Your Ordet Confirmation")
        .setHtml(`
          <h1>Thank you for your order!</h1>
          <p>Your order has been received successfully.</p>
          <p><strong>Total Amount:</strong> ₹${amount}</p>
          <p>We'll contact you once your order is ready for delivery.</p>
          `)
          .setText(`
            Thank you for your order!
            Total Amount: ₹${amount}
            We'll contact you once your order is ready.
            `)
        
      await mailerSend.email.send(customerEmailParams);
    }

    await mailerSend.email.send(adminEmailParams)
  } catch (error) {
    console.error("Failed to send order notification email:", error);
    if (error.body) {
      console.error("MailerSend error details:", error.body);
    }
  }
};
