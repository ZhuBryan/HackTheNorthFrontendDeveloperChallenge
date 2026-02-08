// Type definitions for the HTN Events API

export type TEventType = "workshop" | "activity" | "tech_talk";
export type TPermission = "public" | "private";

export type TSpeaker = {
  name: string;
};

export type TEvent = {
  id: number;
  name: string;
  event_type: TEventType;
  permission?: TPermission;

  start_time: number; // unix timestamp (ms)
  end_time: number; // unix timestamp (ms)

  description?: string;
  speakers: TSpeaker[];

  public_url?: string;
  private_url: string;
  related_events: number[];
};

export type TEndpointResponse = TEvent | TEvent[];
