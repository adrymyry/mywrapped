export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("tb_token")
}

// Set token in localStorage
export function setToken(token: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem("tb_token", token)
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getToken()
}

