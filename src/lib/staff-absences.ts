export const absenceTypes = {
  falta: "Absence",
  ferias: "Annual leave",
  doenca: "Sick leave",
  folga: "Day off",
};

export function absenceTypeLabel(value: string) {
  return absenceTypes[value as keyof typeof absenceTypes] ?? value;
}

export function absenceDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" })
    .format(new Date(value + "T00:00:00Z"));
}
