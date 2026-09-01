import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NEXT_EMAIL_ADD,
        pass: process.env.NEXT_EMAIL_SMTP,
    },
});

interface BookingEmailParams {
    email: string;
    fullName: string;
    tripName: string;
    tripDestination?: string;
    tripDates?: string;
    amount: number;
    amountPaid: number;
    status: "registrationConfirmed" | "confirmed";
    seatNumber?: string;
    bookingId: string;
}

export async function sendBookingConfirmationEmail(params: BookingEmailParams) {
    const {
        email,
        fullName,
        tripName,
        tripDestination,
        tripDates,
        amount,
        amountPaid,
        status,
        seatNumber,
        bookingId,
    } = params;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://con-soul.vercel.app";
    const logoUrl = `${appUrl}/images/logo.png`;

    const isFullyConfirmed = status === "confirmed";
    const remainingAmount = amount - amountPaid;

    const statusLabel = isFullyConfirmed ? "Booking Confirmed ✓" : "Registration Confirmed ✓";
    const statusColor = isFullyConfirmed ? "#16a34a" : "#d97706";
    const statusBg = isFullyConfirmed ? "#f0fdf4" : "#fffbeb";

    const subject = isFullyConfirmed
        ? `🎉 Booking Confirmed – ${tripName} | CONSOUL Travel`
        : `✅ Registration Received – ${tripName} | CONSOUL Travel`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="background-color:#111111;border-radius:16px;overflow:hidden;border:1px solid #2a2a2a;max-width:620px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a1a 0%,#0a0a0a 100%);padding:32px 40px;text-align:center;border-bottom:1px solid #2a2a2a;">
              <img src="${logoUrl}" alt="CONSOUL Travel" width="60" height="60" style="border-radius:50%;object-fit:cover;margin-bottom:12px;display:block;margin:0 auto 12px auto;" />
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#D4AF37;letter-spacing:2px;text-transform:uppercase;">CONSOUL Travel</h1>
              <p style="margin:4px 0 0;font-size:12px;color:#888;letter-spacing:1px;text-transform:uppercase;">Experience the Journey</p>
            </td>
          </tr>

          <!-- STATUS BADGE -->
          <tr>
            <td style="padding:28px 40px 0;text-align:center;">
              <div style="display:inline-block;background-color:${statusBg};color:${statusColor};border:1px solid ${statusColor};border-radius:50px;padding:8px 24px;font-size:14px;font-weight:700;letter-spacing:0.5px;">
                ${statusLabel}
              </div>
            </td>
          </tr>

          <!-- GREETING -->
          <tr>
            <td style="padding:24px 40px 0;">
              <h2 style="margin:0 0 8px;font-size:22px;color:#ffffff;font-weight:600;">Hey ${fullName}! 👋</h2>
              <p style="margin:0;font-size:15px;color:#aaaaaa;line-height:1.6;">
                ${isFullyConfirmed
                    ? "Fantastic news! Your booking is fully confirmed. Get ready for an incredible adventure with CONSOUL Travel!"
                    : "Great news! We've received your registration. Your spot is reserved — complete your remaining payment to lock in your booking."
                }
              </p>
            </td>
          </tr>

          <!-- TRIP DETAILS CARD -->
          <tr>
            <td style="padding:24px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1a1600 0%,#1a1a1a 100%);border:1px solid #D4AF3740;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #2a2a2a;">
                    <p style="margin:0 0 4px;font-size:11px;color:#D4AF37;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Trip</p>
                    <p style="margin:0;font-size:18px;color:#ffffff;font-weight:700;">${tripName}</p>
                    ${tripDestination ? `<p style="margin:4px 0 0;font-size:13px;color:#888;">📍 ${tripDestination}</p>` : ""}
                    ${tripDates ? `<p style="margin:4px 0 0;font-size:13px;color:#888;">📅 ${tripDates}</p>` : ""}
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;">
                          <span style="font-size:13px;color:#888;">Booking ID</span>
                        </td>
                        <td style="padding:6px 0;text-align:right;">
                          <span style="font-size:13px;color:#ffffff;font-family:monospace;">#${bookingId.slice(0, 8).toUpperCase()}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;">
                          <span style="font-size:13px;color:#888;">Total Amount</span>
                        </td>
                        <td style="padding:6px 0;text-align:right;">
                          <span style="font-size:13px;color:#ffffff;font-weight:600;">₹${amount.toLocaleString("en-IN")}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;">
                          <span style="font-size:13px;color:#888;">Amount Paid</span>
                        </td>
                        <td style="padding:6px 0;text-align:right;">
                          <span style="font-size:13px;color:#D4AF37;font-weight:700;">₹${amountPaid.toLocaleString("en-IN")}</span>
                        </td>
                      </tr>
                      ${!isFullyConfirmed && remainingAmount > 0 ? `
                      <tr>
                        <td style="padding:6px 0;">
                          <span style="font-size:13px;color:#888;">Remaining Balance</span>
                        </td>
                        <td style="padding:6px 0;text-align:right;">
                          <span style="font-size:13px;color:#f87171;font-weight:600;">₹${remainingAmount.toLocaleString("en-IN")}</span>
                        </td>
                      </tr>
                      ` : ""}
                      ${seatNumber ? `
                      <tr>
                        <td style="padding:6px 0;">
                          <span style="font-size:13px;color:#888;">Seat Number</span>
                        </td>
                        <td style="padding:6px 0;text-align:right;">
                          <span style="font-size:15px;color:#D4AF37;font-weight:800;background:#1a1600;padding:2px 12px;border-radius:6px;border:1px solid #D4AF3750;">🪑 ${seatNumber}</span>
                        </td>
                      </tr>
                      ` : ""}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA BUTTON -->
          <tr>
            <td style="padding:24px 40px 0;text-align:center;">
              <a href="${appUrl}/my-trips" style="display:inline-block;background:linear-gradient(135deg,#D4AF37,#b8941e);color:#000000;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:700;letter-spacing:0.5px;">
                View My Booking →
              </a>
            </td>
          </tr>

          ${!isFullyConfirmed ? `
          <!-- REMINDER BOX -->
          <tr>
            <td style="padding:24px 40px 0;">
              <div style="background-color:#1a1600;border:1px solid #D4AF3730;border-left:3px solid #D4AF37;border-radius:8px;padding:14px 18px;">
                <p style="margin:0;font-size:13px;color:#D4AF37;font-weight:600;">⚠️ Action Required</p>
                <p style="margin:6px 0 0;font-size:13px;color:#aaaaaa;line-height:1.5;">
                  Please complete your remaining payment of <strong style="color:#ffffff;">₹${remainingAmount.toLocaleString("en-IN")}</strong> before the trip departure to confirm your seat.
                </p>
              </div>
            </td>
          </tr>
          ` : ""}

          <!-- REFUND POLICY NOTE -->
          <tr>
            <td style="padding:16px 40px 0;">
              <div style="background-color:#111111;border:1px solid #2a2a2a;border-radius:8px;padding:12px 16px;">
                <p style="margin:0;font-size:12px;color:#888888;line-height:1.4;">
                  <strong style="color:#D4AF37;">Cancellation & Refund Policy:</strong> The registration deposit is strictly non-refundable if cancelled within 15 days prior to the trip departure date due to advance transport & accommodation bookings.
                </p>
              </div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:32px 40px;text-align:center;border-top:1px solid #2a2a2a;margin-top:28px;">
              <p style="margin:0 0 8px;font-size:13px;color:#555;">Need help? Contact us at</p>
              <a href="mailto:${process.env.NEXT_EMAIL_ADD}" style="color:#D4AF37;font-size:13px;text-decoration:none;">${process.env.NEXT_EMAIL_ADD}</a>
              <p style="margin:16px 0 0;font-size:11px;color:#444;">© ${new Date().getFullYear()} CONSOUL Travel. All rights reserved.</p>
              <p style="margin:4px 0 0;font-size:11px;color:#333;">This is an automated email. Please do not reply directly.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
        from: `"CONSOUL Travel" <${process.env.NEXT_EMAIL_ADD}>`,
        to: email,
        subject,
        html,
    });

    console.log(`[Booking Email] ${status} email sent to ${email} for booking ${bookingId}`);
}

export interface TrainTicketEmailParams {
    email: string;
    tripName: string;
    tripDestination: string;
    passengerName: string;
    passengerAge: number;
    seatNumber: string;
}

export async function sendTrainTicketEmail(params: TrainTicketEmailParams) {
    const {
        email,
        tripName,
        tripDestination,
        passengerName,
        passengerAge,
        seatNumber,
    } = params;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://con-soul.vercel.app";
    const logoUrl = `${appUrl}/images/logo.png`;

    const subject = `🎫 Train Ticket Allotted – ${tripName} | CONSOUL Travel`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#111111;border-radius:16px;overflow:hidden;border:1px solid #2a2a2a;max-width:600px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a1a 0%,#0a0a0a 100%);padding:32px 40px;text-align:center;border-bottom:1px solid #2a2a2a;">
              <img src="${logoUrl}" alt="CONSOUL Travel" width="60" height="60" style="border-radius:50%;object-fit:cover;margin-bottom:12px;display:block;margin:0 auto 12px auto;" />
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#D4AF37;letter-spacing:2px;text-transform:uppercase;">CONSOUL</h1>
            </td>
          </tr>

          <!-- SUBHEADER -->
          <tr>
            <td style="padding:28px 40px 0;text-align:center;">
              <h2 style="margin:0 0 8px;font-size:20px;color:#ffffff;font-weight:600;">${tripName}</h2>
              <p style="margin:0;font-size:15px;color:#aaaaaa;letter-spacing:1px;text-transform:uppercase;">📍 ${tripDestination}</p>
            </td>
          </tr>

          <!-- TICKET DETAILS -->
          <tr>
            <td style="padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1a1600 0%,#1a1a1a 100%);border:1px solid #D4AF3740;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #2a2a2a;text-align:center;">
                    <p style="margin:0 0 4px;font-size:11px;color:#D4AF37;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Passenger Ticket</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;width:40%;">
                          <span style="font-size:14px;color:#888;text-transform:uppercase;letter-spacing:1px;">Passenger Name</span>
                        </td>
                        <td style="padding:8px 0;text-align:right;">
                          <span style="font-size:16px;color:#ffffff;font-weight:600;">${passengerName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;">
                          <span style="font-size:14px;color:#888;text-transform:uppercase;letter-spacing:1px;">Age</span>
                        </td>
                        <td style="padding:8px 0;text-align:right;border-bottom:1px solid #2a2a2a;">
                          <span style="font-size:16px;color:#ffffff;font-weight:600;">${passengerAge} Yrs</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:16px 0 8px;">
                          <span style="font-size:14px;color:#D4AF37;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Seat / Berth No.</span>
                        </td>
                        <td style="padding:16px 0 8px;text-align:right;">
                          <span style="font-size:20px;color:#D4AF37;font-weight:800;background:#1a1600;padding:6px 16px;border-radius:8px;border:1px solid #D4AF3750;">🪑 ${seatNumber}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:32px 40px;text-align:center;border-top:1px solid #2a2a2a;">
              <p style="margin:0 0 8px;font-size:13px;color:#555;">Have a safe and wonderful journey!</p>
              <p style="margin:16px 0 0;font-size:11px;color:#444;">© ${new Date().getFullYear()} CONSOUL Travel. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
        from: `"CONSOUL Travel" <${process.env.NEXT_EMAIL_ADD}>`,
        to: email,
        subject,
        html,
    });

    console.log(`[Train Ticket Email] Sent to ${email} for passenger ${passengerName}`);
}
