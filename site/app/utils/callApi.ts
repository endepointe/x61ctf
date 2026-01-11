

async function callApi(url: string, token: string, data = null) {
  const result = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: data 
  });
  console.log(result);
  return await result.json();
}

export { callApi };
