import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function navigateToJobProfileStep(profile: Record<string, any>, router: AppRouterInstance) {
  if (typeof window === "undefined") return;

  const id = profile.jobProfileId || profile.id;
  
  const rawStatus = (profile.status || "Approved").toLowerCase();
  const isDraft = rawStatus.includes("draft");
  
  const savedStep = localStorage.getItem(`samvaad_saathi_draft_step_${id}`);
  
  // If it's already submitted (not a draft), always go to the review page
  const targetStep = (!isDraft || !savedStep) ? "5" : savedStep;

  if (targetStep === "5") {
    // Just viewing a completed role, don't overwrite draft state
    router.push(`/dashboard/roles/new?step=5&profileId=${id}&status=${encodeURIComponent(profile.status || "Approved")}`);
  } else {
    const previousProfileId = localStorage.getItem("samvaad_saathi_draft_profile_id");
    let existingDraft: Record<string, any> = {};
    const savedDraft = localStorage.getItem(`samvaad_saathi_draft_role_${id}`);
    if (savedDraft) {
      try {
        existingDraft = JSON.parse(savedDraft);
      } catch (e) {
        console.error("Failed to parse existing draft", e);
        localStorage.removeItem(`samvaad_saathi_draft_role_${id}`);
      }
    }

    localStorage.setItem("samvaad_saathi_draft_profile_id", id.toString());

    const formDraft = {
      jdType: "role",
      jobName: profile.jobName || profile.title || existingDraft.jobName || "",
      companyName: profile.companyName || existingDraft.companyName || "",
      category: profile.category || existingDraft.category || "",
      experienceLevel: profile.experienceLevel || existingDraft.experienceLevel || "",
      employmentType: profile.employmentType || existingDraft.employmentType || "",
      jobDescription: profile.jobDescription || profile.description || existingDraft.jobDescription || "",
      skills: (profile.skills?.length ? profile.skills : existingDraft.skills) || [],
    };
    localStorage.setItem(`samvaad_saathi_draft_role_${id}`, JSON.stringify(formDraft));

    if (targetStep === "4") {
      router.push("/dashboard/roles/new/questions");
    } else {
      router.push(`/dashboard/roles/new?step=${targetStep}`);
    }
  }
}
