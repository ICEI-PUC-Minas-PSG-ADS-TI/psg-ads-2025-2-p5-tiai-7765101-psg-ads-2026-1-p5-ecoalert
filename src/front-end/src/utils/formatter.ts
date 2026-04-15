import { Address } from "@/types/ValueObjects";

export function formatToCurrency(value: number, locale: string = "pt-BR", currency: string = "BRL"): string {
 return value.toLocaleString(locale, {
    style: 'currency',
    currency: currency
  });
}

export function formatPath(path = "") {
  return path
    .replace(/^\/+/, "")
    .split("/")
    .map(
      part =>
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    .join(" ")
    .split(" ")[0];
}

export function maskCpf(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function maskCep(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function maskInstagram(value: string) {
  if (!value) return "";

  const sanitized = value
    .replace(/\s/g, "")  
    .replace(/@+/g, "@");

  if (sanitized.startsWith("@")) {
    return sanitized;
  }

  return `@${sanitized}`;
}

export function formatDate(dateInput: any, fullDate = false) {
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    return "Data inválida";
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  let formattedDate = `${day}/${month}/${year}`;

  if (fullDate) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    formattedDate += ` ${hours}:${minutes}`;
  }

  return formattedDate;
};

export function maskCurrency(value: string) {
  const onlyNumbers = value.replace(/\D/g, "");

  const number = Number(onlyNumbers) / 100;

  if (Number.isNaN(number)) return "";

  return number.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function maskDate(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d+?)$/, "$1");
}

export function parseToLocalDateTime(value: string) {
  if (!value || value.length !== 8) return value; // Retorna o que tiver se não estiver completo

  const day = value.substring(0, 2);
  const month = value.substring(2, 4);
  const year = value.substring(4, 8);

  return `${year}-${month}-${day}T00:00:00`;
}

export function formatAddressToString(address: Address) {
  return `${address.street} ${address.number}, ${address.neighborhood}, ${address.city}`;
}