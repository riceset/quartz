// Outline weather icons on the same 24×24 grid and 2px stroke as the social icons. The
// splash renders them all hidden; its script reveals the one matching Tokyo's weather.

const cloudBase = "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"

export const weatherIcons: Record<string, string[]> = {
  // Clear sky is drawn solid (filled disc, filled crescent with a star) so it doesn't read
  // as the theme toggle's outline sun and moon sitting on the same bar.
  clear: [
    "fill:M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z",
    "M12 2v2",
    "M12 20v2",
    "m4.93 4.93 1.41 1.41",
    "m17.66 17.66 1.41 1.41",
    "M2 12h2",
    "M20 12h2",
    "m6.34 17.66-1.41 1.41",
    "m19.07 4.93-1.41 1.41",
  ],
  "clear-night": ["fill:M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z", "M19 2v4", "M21 4h-4"],
  partly: [
    "M12 2v2",
    "m4.93 4.93 1.41 1.41",
    "M20 12h2",
    "m19.07 4.93-1.41 1.41",
    "M15.947 12.65a4 4 0 0 0-5.925-4.128",
    "M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z",
  ],
  "partly-night": [
    "M13 16a3 3 0 1 1 0 6H7a5 5 0 1 1 4.9-6Z",
    "M10.1 9A6 6 0 0 1 16 4a4 4 0 0 0 6 6 6 6 0 0 1-3 5.197",
  ],
  cloudy: ["M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"],
  fog: [cloudBase, "M16 17H7", "M17 21H9"],
  drizzle: [cloudBase, "M8 19v1", "M8 14v1", "M16 19v1", "M16 14v1", "M12 21v1", "M12 16v1"],
  rain: [cloudBase, "M16 14v6", "M8 14v6", "M12 16v6"],
  snow: [
    cloudBase,
    "M8 15h.01",
    "M8 19h.01",
    "M12 17h.01",
    "M12 21h.01",
    "M16 15h.01",
    "M16 19h.01",
  ],
  storm: ["M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973", "m13 12-3 5h4l-3 5"],
}

export const WeatherIcons = () => (
  <>
    {Object.entries(weatherIcons).map(([key, paths]) => (
      <svg
        class="weather-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        data-weather-icon={key}
        hidden
      >
        {paths.map((d) =>
          d.startsWith("fill:") ? <path d={d.slice(5)} fill="currentColor" /> : <path d={d} />,
        )}
      </svg>
    ))}
  </>
)
