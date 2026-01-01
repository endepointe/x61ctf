

async function callApi(url: string, token: string) {
  const result = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: null
  });
  const data = await result.json();
  return data;
}

export { callApi };
