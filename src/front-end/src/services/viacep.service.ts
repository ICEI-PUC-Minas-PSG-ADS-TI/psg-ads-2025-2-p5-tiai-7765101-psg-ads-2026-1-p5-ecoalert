export async function fetchAddressByCep(cep: string) {
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data = await response.json();

  if (data.erro) throw new Error("CEP inválido");

  return {
    street: data.logradouro,
    neighborhood: data.bairro,
    city: data.localidade,
    state: data.estado || data.uf,
  };
}
