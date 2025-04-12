import nodemailer from "nodemailer";

export const sendOrderEmail = async (order) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, 
      subject: `🛒 New Order from ${order.name}`,
      html: `
        <h3>New Order Received</h3>
        <p><strong>User:</strong> ${order.name}</p>
        <p><strong>Items:</strong></p>
        <ul>
          ${order.products.map((item) => `<li>${item.name}-${item.category}(${item.quantity})</li>`).join("")}
        </ul>
        <p><strong>Total:</strong> Rs. ${order.amount}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Address:</strong> ${order.address}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error(err);
  }
};