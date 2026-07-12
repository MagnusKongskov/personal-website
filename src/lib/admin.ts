export const ADMIN_EMAIL = "primary@magnuskongskov.dk";

export function isAdminEmail(email: string | null | undefined): boolean {
  return email?.toLowerCase() === ADMIN_EMAIL;
}
