import * as nodemailer from 'nodemailer';
import { sendEmail } from '../../src/controllers/emailController';

// Mock nodemailer and its methods
jest.mock('nodemailer', () => ({
  createTransport: jest.fn()
    .mockReturnValue({
      sendMail: jest.fn()
        .mockResolvedValue(true), // Mock sendMail to resolve without sending email
    }),
}));

describe('sendEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test to ensure a clean slate
  });

  it('should send an email with the correct parameters', async () => {
    // Arrange
    const subject = 'Test Subject';
    const name = 'John Doe';
    const request = 'This is a test request.';
    const emailAddress = 'test@example.com';

    const transporterMock = nodemailer.createTransport();
    const sendMailMock = transporterMock.sendMail as jest.Mock;

    // Act
    await sendEmail(subject, name, request, emailAddress);

    // Assert
    expect(nodemailer.createTransport)
      .toHaveBeenCalledWith({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

    expect(sendMailMock)
      .toHaveBeenCalledWith({
        from: process.env.SMTP_USER,
        to: emailAddress,
        subject: subject,
        text: `Hey: ${name},\n${request}`,
      });
  });

  it('should throw an error if email sending fails', async () => {
    // Arrange: Mock sendMail to reject with an error
    const subject = 'Test Subject';
    const name = 'John Doe';
    const request = 'This is a test request.';
    const emailAddress = 'test@example.com';

    const transporterMock = nodemailer.createTransport();
    const sendMailMock = transporterMock.sendMail as jest.Mock;
    sendMailMock.mockRejectedValueOnce(new Error('Email sending failed'));

    // Act & Assert
    await expect(sendEmail(subject, name, request, emailAddress))
      .rejects.toThrow('Email sending failed');
  });
});
