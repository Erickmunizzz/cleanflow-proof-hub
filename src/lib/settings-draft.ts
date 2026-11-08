export type SettingsDraft = {
  company: { name: string; email: string; phone: string; address: string; logoUrl: string };
  system: { timezone: string; language: string };
  welcome: { emailSubject: string; emailBody: string; smsBody: string };
  cleaningTypes: string;
  absenceTypes: string;
  resourceCategories: string;
  notifications: { checkIn: boolean; cancellations: boolean; inventory: boolean };
  policies: { attendance: string; cancellation: string; healthAndSafety: string };
};

// Empty company details and policies are intentional: never invent business data.
export const createSettingsDraft = (): SettingsDraft => ({
  company: { name: "", email: "", phone: "", address: "", logoUrl: "" },
  system: { timezone: "Europe/London", language: "en-GB" },
  welcome: { emailSubject: "", emailBody: "", smsBody: "" },
  cleaningTypes: "", absenceTypes: "", resourceCategories: "",
  notifications: { checkIn: false, cancellations: false, inventory: false },
  policies: { attendance: "", cancellation: "", healthAndSafety: "" },
});