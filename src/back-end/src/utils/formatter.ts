import { Phone } from "@/types/shared";

export function parsePhone(phone: string): Phone {
  const clean = phone.replace(/\D/g, "");

  const ddd = clean.slice(0, 2);
  const number = clean.slice(2);

  return {
    ddd,
    number
  };
}