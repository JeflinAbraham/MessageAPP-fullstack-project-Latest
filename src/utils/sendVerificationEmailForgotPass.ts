import { resend } from "@/lib/resend";
import verificationEmailForgotPass from "../../emails/verificationEmailForgotPass";
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmailForgotPass(
  email: string,
  username: string,
  verifyCode: string

  // the return type of this function is a promise of type ApiResponse
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: "jeflinabraham21@gmail.com",
      subject: 'Password reset verification code',
      react: verificationEmailForgotPass({ email, otp: verifyCode }),
    });
    return { success: true, message: 'Verification email sent successfully.' };
  } 
  catch (emailError) {
    return { success: false, message: 'Failed to send verification email.' };
  }
}