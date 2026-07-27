"use server";

import { redirect } from "next/navigation";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

function cleanText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function submitContact(formData: FormData) {
  const supabase = await createClient();

  const name = cleanText(formData.get("name"));
  const email = cleanText(formData.get("email")).toLowerCase();
  const subject = cleanText(formData.get("subject"));
  const message = cleanText(formData.get("message"));

  if (name.length < 2) {
    redirect("/contact?error=ten-khong-hop-le");
  }

  if (!email || !email.includes("@")) {
    redirect("/contact?error=email-khong-hop-le");
  }

  if (message.length < 10) {
    redirect("/contact?error=noi-dung-qua-ngan");
  }

  const { error: databaseError } = await supabase
    .from("contacts")
    .insert({
      name,
      email,
      subject: subject || null,
      message,
      is_read: false,
    });

  if (databaseError) {
    console.error("Lỗi lưu liên hệ:", databaseError);

    redirect(
      `/contact?error=${encodeURIComponent(
        "Không thể lưu thông tin liên hệ."
      )}`
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL;

  if (!apiKey || !receiverEmail) {
    console.error("Thiếu biến môi trường Resend");

    redirect(
      `/contact?error=${encodeURIComponent(
        "Đã lưu liên hệ nhưng chưa gửi được email."
      )}`
    );
  }

  const resend = new Resend(apiKey);

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject || "Không có tiêu đề");
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  const { error: emailError } = await resend.emails.send({
    from: "Nhìn Lại Mình Đi <onboarding@resend.dev>",
    to: [receiverEmail],
    replyTo: email,
    subject: `[Liên hệ website] ${
      subject || "Tin nhắn mới từ người xem"
    }`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Bạn có một liên hệ mới</h2>

        <p><strong>Họ tên:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Tiêu đề:</strong> ${safeSubject}</p>

        <hr />

        <p><strong>Nội dung:</strong></p>
        <div>${safeMessage}</div>
      </div>
    `,
  });

  if (emailError) {
    console.error("Lỗi gửi email Resend:", emailError);

    redirect(
      `/contact?error=${encodeURIComponent(
        "Đã lưu liên hệ nhưng email thông báo chưa gửi được."
      )}`
    );
  }

  redirect("/contact?success=1");
}