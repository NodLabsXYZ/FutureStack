const simpleApiCall = async (relativePath, method, body) => {
  const data = {
    method: method,
    headers: { 'Content-Type': 'application/json' }
  }

  if (body) {
    data.body = JSON.stringify(body)
  }

  const response = await fetch(`/api/${relativePath}`, data);
  const json = await response.json();
  const { status } = response;
  return { json, status };
}

export default simpleApiCall;