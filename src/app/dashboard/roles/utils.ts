export function navigateToJobProfileStep(profile: any, router: any) {
  if (typeof window === "undefined") return;

  const id = profile.jobProfileId || profile.id;
  const savedStep = localStorage.getItem(`samvaad_saathi_draft_step_${id}`);
  const targetStep = savedStep ? savedStep : "5";

  if (targetStep === "5") {
    // Just viewing a completed role, don't overwrite draft state
    router.push(`/dashboard/roles/new?step=5&profileId=${id}`);
  } else {
    const previousProfileId = localStorage.getItem("samvaad_saathi_draft_profile_id");
    let existingDraft = {};
    if (previousProfileId === id.toString()) {
      const savedDraft = localStorage.getItem("samvaad_saathi_draft_role");
      if (savedDraft) {
        try {
          existingDraft = JSON.parse(savedDraft);
        } catch (e) {}
      }
    }

    localStorage.setItem("samvaad_saathi_draft_profile_id", id.toString());

    const formDraft = {
      jdType: "role",
      jobName: profile.jobName || profile.title || (existingDraft as any).jobName || "",
      companyName: profile.companyName || (existingDraft as any).companyName || "",
      category: profile.category || (existingDraft as any).category || "",
      experienceLevel: profile.experienceLevel || (existingDraft as any).experienceLevel || "",
      employmentType: profile.employmentType || (existingDraft as any).employmentType || "",
      jobDescription: profile.jobDescription || profile.description || (existingDraft as any).jobDescription || "",
      skills: (profile.skills?.length ? profile.skills : (existingDraft as any).skills) || [],
    };
    localStorage.setItem("samvaad_saathi_draft_role", JSON.stringify(formDraft));

    if (targetStep === "4") {
      router.push("/dashboard/roles/new/questions");
    } else {
      router.push(`/dashboard/roles/new?step=${targetStep}`);
    }
  }
}
