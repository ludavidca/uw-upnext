import { events } from "../types/eventType";

interface Timeline {
  [date: string]: events[];
}

export function CreateTimeline(response: events[]) {
  let timeline: Timeline = {};

  for (const index in response) {
    const startTime = response[index].event_details.start_time;
    const dateTime = new Date(startTime * 1000);
    const formattedDate = dateTime.toDateString().substring(4);
    if (formattedDate in Object.keys(timeline)) {
      timeline[formattedDate].push(response[index]);
    } else {
      timeline[formattedDate] = [response[index]];
    }
  }
      const timelineArray = Object.entries(timeline);
      return timelineArray;
}