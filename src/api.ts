import { TEvent, TEndpointResponse } from "./types";

const API_BASE_URL = "https://api.hackthenorth.com/v3";

/**
 * Fetch all events from the API
 */
export async function fetchAllEvents(): Promise<TEvent[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/events`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: TEndpointResponse = await response.json();
    
    // The /events endpoint returns TEvent[]
    if (Array.isArray(data)) {
      return data;
    }
    return [data];
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

/**
 * Fetch a specific event by ID
 */
export async function fetchEventById(id: number): Promise<TEvent> {
  try {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: TEndpointResponse = await response.json();

    if (Array.isArray(data)) {
      return data[0];
    }
    return data;
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    throw error;
  }
}
