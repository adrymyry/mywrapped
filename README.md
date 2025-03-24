## App

This is a Spotify Wrapped clone. It's based on this version: https://images.ctfassets.net/c1zhnszcah7h/2szccTy52nQoUtiApSJIi2/2e8cc4fafaffd7edd9abf002506827ff/Header_01__1_.png?w=1000&h=597&q=96&fm=webp.

The app should provide a way to display the different analytics provided by the Tinybird backend. These analytics must be easily shareable using cards in social media.

Use a basic login based on the TB_TOKEN. It must be provided by the user and stored into the browser storage.

## Tinybird

### Overview
This project implements a music listening analytics system that tracks and analyzes user listening patterns from Web Scrobbler browser extension. It provides insights about listening habits including total listening time, favorite artists, and most played songs.

### Data Sources

#### web_scrobbler_events
Tracks user listening events from Web Scrobbler browser extension, including detailed song information and playback status.

Example of how to ingest data:
```bash
curl -X POST "https://api.europe-west2.gcp.tinybird.co/v0/events?name=web_scrobbler_events" \
    -H "Authorization: Bearer $TB_ADMIN_TOKEN" \
    -d '{
        "time": "2023-12-01 12:00:00.000",
        "eventName": "songPlaying",
        "data": {
            "song": {
                "parsed": {
                    "track": "El cielo no entiende",
                    "artist": "OBK",
                    "album": "Antropop",
                    "duration": 229,
                    "uniqueID": "spotify:track:648Myn15scOB98wpZ9jd3c"
                },
                "metadata": {
                    "trackArtUrl": "https://example.com/art.jpg",
                    "artistUrl": "https://example.com/artist",
                    "trackUrl": "https://example.com/track",
                    "albumUrl": "https://example.com/album"
                },
                "connector": {
                    "id": "spotify"
                }
            }
        }
    }'
```

### Endpoints

#### listening_stats
Gets overall listening statistics including total hours listened and unique counts of songs, artists, and albums from Web Scrobbler data.

```bash
curl -X GET "https://api.europe-west2.gcp.tinybird.co/v0/pipes/listening_stats.json?token=$TB_ADMIN_TOKEN&start_date=2023-01-01%2000:00:00&end_date=2023-12-31%2023:59:59"
```

#### top_artists
Retrieves most listened to artists within a specified time period from Web Scrobbler data, including play counts and listening duration.

```bash
curl -X GET "https://api.europe-west2.gcp.tinybird.co/v0/pipes/top_artists.json?token=$TB_ADMIN_TOKEN&start_date=2023-01-01%2000:00:00&end_date=2023-12-31%2023:59:59&limit=5"
```

#### top_songs
Gets most played songs within a specified time period from Web Scrobbler data, including play counts and total listening time.

```bash
curl -X GET "https://api.europe-west2.gcp.tinybird.co/v0/pipes/top_songs.json?token=$TB_ADMIN_TOKEN&start_date=2023-01-01%2000:00:00&end_date=2023-12-31%2023:59:59&limit=10"
```

Note: All DateTime parameters must be formatted as YYYY-MM-DD HH:MM:SS to ensure proper functionality.
