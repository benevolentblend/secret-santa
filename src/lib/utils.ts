import { type GameStatus, type UserRole } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type PromoteStatus = Exclude<GameStatus, "Complete">;
type DemoteStatus = Exclude<GameStatus, "Setup">;

export const getPromoteGameStatus = (state: PromoteStatus): GameStatus => {
  if (state === "Setup") {
    return "Sorting";
  }

  if (state === "Sorting") {
    return "Active";
  }

  return "Complete";
};

export const getDemoteGameStatus = (state: DemoteStatus): GameStatus => {
  if (state === "Complete") {
    return "Active";
  }

  if (state === "Active") {
    return "Sorting";
  }

  return "Setup";
};

export const hasUserAccess = (role: UserRole) =>
  ["User", "Moderator", "Admin"].includes(role);

export const hasModeratorAccess = (role: UserRole) =>
  ["Moderator", "Admin"].includes(role);

export const hasAdminAccess = (role: UserRole) => role === "Admin";
