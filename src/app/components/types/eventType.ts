export interface event_details {
  return_id: string;
  is_event: boolean;
  event_name: string;
  event_description: string;
  event_categories: string[];
  start_time: number;
  end_time: number | null;
  location: string | null;
}

export interface events {
  _id: string;
  account: string;
  date: string;
  caption: string;
  accessibility_caption: string;
  hashtags: string;
  id: number;
  url: string;
  likes: number;
  display_photo: string;
  is_event: boolean;
  embedded: number[][];
  event_details: event_details;
}
