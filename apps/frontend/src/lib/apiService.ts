const API_URL = process.env.NEXT_PUBLIC_API_URL

// Function to read cookies from document.cookie
const getToken = () => {
  const cookies = document.cookie.split("; ") ?? [];
  const tokenCookie = cookies.find((row) => row.startsWith("session="));
  return tokenCookie ? tokenCookie.split("=")[1] : "";
};

// Helper function for fetch requests
const request = async (method: string, url: string, data?: any) => {
  const token = getToken(); // Fetch token from cookies

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
  };

  const response = await fetch(`${API_URL}${url}`, options);
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};

// Auth service functions
const apiService = {
  get: (url: string) => request("GET", url),
  post: (url: string, data: any) => request("POST", url, data),
  put: (url: string, data: any) => request("PUT", url, data),
  patch: (url: string, data: any) => request("PATCH", url, data),
  delete: (url: string) => request("DELETE", url),
};

export default apiService;
