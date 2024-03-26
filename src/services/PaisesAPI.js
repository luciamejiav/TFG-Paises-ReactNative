const API = "https://restcountries.com/v3.1";

//para sacar la información de todos los paises
export async function getPaisesAll() {
  const data = await fetch(`${API}/all`);
  const json = await data.json();
  console.log(json);
  return json;
}