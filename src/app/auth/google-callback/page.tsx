import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Google ile giriş sonrası ödeme durumunu kontrol eder
export default async function GoogleCallbackPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  // Geliştirme sırasında: isPaid durumuna göre yönlendir
  if (session.user.isPaid) {
    redirect("/dashboard");
  } else {
    // TODO: Gerçek Stripe key eklendiğinde ödeme akışı aktif edilecek
    // Şimdilik dashboard'a yönlendir (geliştirme modu)
    redirect("/dashboard");
  }
}
