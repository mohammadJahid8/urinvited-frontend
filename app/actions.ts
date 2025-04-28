"use server";

export async function getCountry() {
  const response = await fetch("https://api.country.is/");
  const data = await response.json();

  return data.country;
}
