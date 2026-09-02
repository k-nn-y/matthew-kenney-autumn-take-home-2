/**
 * The translation layer. The database speaks ad-platform; the reader runs an
 * inn. Every channel is named by what the guest was doing, never by what the
 * ad product is called, and the map is closed: an unknown category falls back
 * to plain words rather than leaking a platform term onto the sheet.
 */

type ChannelWords = {
  /** Panel row: "Guests searching for you by name" */
  long: string;
  /** Ledger column: "Searched for you by name" */
  short: string;
};

const CHANNELS: Record<string, ChannelWords> = {
  branded_search: {
    long: "Guests searching for you by name",
    short: "Searched for you by name",
  },
  hotel_ads: {
    long: "Guests comparing room prices",
    short: "Compared room prices",
  },
  nonbranded_search: {
    long: "Guests looking for a place to stay",
    short: "Looked for a place to stay",
  },
  maps: {
    long: "Guests finding you on the map",
    short: "Found you on the map",
  },
};

export function channelLong(category: string | null): string {
  return (category && CHANNELS[category]?.long) || "Guests who saw an ad";
}

export function channelShort(category: string | null): string {
  return (category && CHANNELS[category]?.short) || "Saw an ad";
}

/** The four categories in the order the panel always shows them. */
export const CHANNEL_ORDER = [
  "branded_search",
  "hotel_ads",
  "nonbranded_search",
  "maps",
];

/** "Stowe, VT" is how the row was seeded; the sidebar says it in full. */
export function spokenTown(town: string): string {
  return town.replace(/,\s*VT$/, ", Vermont");
}
