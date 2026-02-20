export enum UserRole {
  User = "user",
  Lulu = "lulu",
  Admin = "admin",
  Operator = "operator",
  SuperAdmin = "superadmin",
}

export const ROLES = [
  { value: UserRole.SuperAdmin, label: 'Super Admin' },
  { value: UserRole.Admin, label: 'Admin' },
  { value: UserRole.Operator, label: 'Operator' },
  { value: UserRole.Lulu, label: 'Lulu' },
  { value: UserRole.User, label: 'User' },
] as const