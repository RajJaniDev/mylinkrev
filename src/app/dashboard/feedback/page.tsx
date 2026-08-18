import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FeedbackDashboard, FeedbackItem } from "@/components/FeedbackDashboard";
import { revalidatePath } from "next/cache";

export default async function FeedbackPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  // Fetch business for logged in user
  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!business) {
    redirect("/dashboard");
  }

  const socials = business.social_links || {};
  const rawFeedbacks = Array.isArray(business.feedbacks)
    ? business.feedbacks
    : (Array.isArray(socials.feedbacks) ? socials.feedbacks : []);

  const feedbacks: FeedbackItem[] = rawFeedbacks.map((f: any) => ({
    id: f.id || Math.random().toString(36).substring(2, 10),
    name: f.name || "Anonymous",
    contact: f.contact || f.email_or_phone || "Not provided",
    message: f.message || "",
    stars: Number(f.stars || 3),
    created_at: f.created_at || new Date().toISOString()
  }));

  // Server Action to delete a customer feedback item
  async function deleteFeedback(feedbackId: string) {
    "use server";
    const currentUserReq = await currentUser();
    if (!currentUserReq) return;

    const { data: b } = await supabase
      .from("businesses")
      .select("id, feedbacks, social_links")
      .eq("user_id", currentUserReq.id)
      .single();

    if (!b) return;

    const existingSocials = b.social_links || {};
    const existingList = Array.isArray(b.feedbacks)
      ? b.feedbacks
      : (Array.isArray(existingSocials.feedbacks) ? existingSocials.feedbacks : []);

    const updatedFeedbacks = existingList.filter((item: any) => item.id !== feedbackId);

    // Primary update: 'feedbacks' column
    const { error: updateError } = await supabase
      .from("businesses")
      .update({ feedbacks: updatedFeedbacks })
      .eq("id", b.id);

    // Fallback update: 'social_links.feedbacks'
    if (updateError) {
      const updatedSocials = {
        ...existingSocials,
        feedbacks: updatedFeedbacks
      };
      await supabase
        .from("businesses")
        .update({ social_links: updatedSocials })
        .eq("id", b.id);
    }

    revalidatePath("/dashboard/feedback");
    revalidatePath("/dashboard");
  }

  return (
    <div className="animate-fade-in">
      <FeedbackDashboard 
        feedbacks={feedbacks} 
        deleteFeedbackAction={deleteFeedback} 
      />
    </div>
  );
}
