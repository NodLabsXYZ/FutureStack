const simpleApiCall = async (relativePath, method, body) => {
  const data = {
    method: method,
    headers: { 'Content-Type': 'application/json' }
  }

  if (body) {
    data.body = JSON.stringify(body)
  }

  const response = await fetch(`/api/${relativePath}`, data);
  return await response.json();
}

export default simpleApiCall;