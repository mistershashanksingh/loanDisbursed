import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const body = req.body;

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER, // Your email address
        pass: process.env.SMTP_PASS, // Your email password or app password
      },
    });

    // Format the email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER, // Where to receive applications
      subject: `New Loan App: ${body.fullName} - ₹${body.loanAmount}`,
      html: `
        <h2 style="color: #0077ff;">New Loan Application</h2>
        <h3>Personal Information</h3>
        <p><strong>Name:</strong> ${body.fullName}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Phone:</strong> ${body.phone}</p>
        <p><strong>PAN Card:</strong> ${body.panCard}</p>
        <hr />
        <h3>Loan Details</h3>
        <p><strong>Type:</strong> ${body.loanType}</p>
        <p><strong>Amount:</strong> ₹${body.loanAmount}</p>
        <p><strong>Purpose:</strong> ${body.purpose}</p>
        <p><strong>Tenure:</strong> ${body.tenure}</p>
        <hr />
        <h3>Employment Profile</h3>
        <p><strong>Type:</strong> ${body.employmentType}</p>
        <p><strong>Monthly Income:</strong> ₹${body.monthlyIncome}</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Reply to the frontend that it was successful
    return res.status(200).json({ success: true, message: 'Application sent successfully' });
    
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send application' });
  }
}