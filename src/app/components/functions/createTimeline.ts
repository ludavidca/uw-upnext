import { events } from "../types/eventType";

interface Timeline {
  [date: string]: events[];
}

export function CreateTimeline(response: events[]) {
  let timeline: Timeline = {};

  // A Set to track unique events
  const seenEvents = new Set<string>();

  // Get yesterday's date
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0); // Set to start of yesterday

  // Populate the timeline object
  for (const event of response) {
    const startTime = event.event_details.start_time;
    const dateTime = new Date(startTime * 1000);
    dateTime.setHours(0, 0, 0, 0); // Set time to midnight for comparison

    // Skip events that occurred before or on yesterday
    if (dateTime <= yesterday) {
      continue;
    }

    const formattedDate = dateTime.toDateString(); // e.g., "Mon Aug 26 2024"

    // Create a unique key based on title and start time
    const eventKey = `${event.event_details.event_name}-${startTime}`;

    // Skip if the event has already been seen
    if (!seenEvents.has(eventKey)) {
      seenEvents.add(eventKey);
      if (formattedDate in timeline) {
        timeline[formattedDate].push(event);
      } else {
        timeline[formattedDate] = [event];
      }
    }
  }

  const timelineArray = Object.entries(timeline).sort(([dateA], [dateB]) => {
    const dateAObj = new Date(dateA);
    const dateBObj = new Date(dateB);
    return dateAObj.getTime() - dateBObj.getTime();
  });

  return timelineArray;
};
