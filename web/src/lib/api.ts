import { getToken } from "./auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_TINYBIRD_API_URL || "http://localhost:7181/v0/pipes"

// Helper function to make API requests
async function fetchFromTinybird(endpoint: string, params: Record<string, string> = {}) {
  const token = getToken()
  if (!token) {
    throw new Error("No authentication token found")
  }

  // Default date range for the current year
  const currentYear = new Date().getFullYear()
  const startDate = params.start_date || `${currentYear}-01-01 00:00:00`
  const endDate = params.end_date || `${currentYear}-12-31 23:59:59`

  // Build query parameters
  const queryParams = new URLSearchParams({
    token,
    start_date: startDate,
    end_date: endDate,
    ...params,
  })

  const response = await fetch(`${API_BASE_URL}/${endpoint}.json?${queryParams}`)

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  const data = await response.json()
  return data.data
}

// Fetch overall listening statistics
export async function fetchListeningStats() {
  const data = await fetchFromTinybird("listening_stats")
  return (
    data[0] || {
      total_minutes_listened: 0,
      unique_songs: 0,
      unique_artists: 0,
      unique_albums: 0,
    }
  )
}

// Fetch top artists
export async function fetchTopArtists(limit = 5) {
  return fetchFromTinybird("top_artists", { limit: limit.toString() })
}

// Fetch top songs
export async function fetchTopSongs(limit = 10) {
  return fetchFromTinybird("top_songs", { limit: limit.toString() })
}

