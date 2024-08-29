import { NextRequest, NextResponse } from "next/server";
import { availableParallelism } from "os";
import { EventAttributes } from "ics";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.

export async function GET(req: NextRequest) {
  try {

    const { searchParams } = new URL(req.url);

    const name = searchParams.get("name");
    const description = searchParams.get("description");
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");
    const location = searchParams.get("location");
    const account = searchParams.get("account");

    if (!name || !description || !startTime || !endTime || !account) {
    return NextResponse.json(
        { error: "All parameters (name, description, startTime, endTime, account) are required" },
        { status: 400 }
    );
}
    const extractTimeArray = function (date: Date) {
      return [
        date.getFullYear(),
        date.getMonth(),
        date.getDay(),
        date.getHours(),
        date.getMinutes(),
      ];
    };

    const events = absences.map((absence) => {
      const attendees = [
        {
          name:
            absence.absentTeacher.firstName +
            " " +
            absence.absentTeacher.lastName,
          email: absence.absentTeacher.email,
          rsvp: true,
          partstat: "TENTATIVE",
          role: "OPT-PARTICIPANT",
        },
      ];

      if (absence.substituteTeacher) {
        attendees.push({
          name:
            absence.substituteTeacher.firstName +
            " " +
            absence.substituteTeacher.lastName,
          email: absence.substituteTeacher.email,
          rsvp: true,
          partstat: "TENTATIVE",
          role: "REQ-PARTICIPANT",
        });
      }

      return {
        // start: [2024, 7, 8, 12, 15],
        start: absence.lessonDate.getTime(),
        duration: { hours: 2, minutes: 30 },
        title:
          absence.absentTeacher.firstName +
          " " +
          absence.absentTeacher.lastName +
          "'s " +
          absence.subject,
        description:
          "For issues regarding unclaiming absences and lesson plans, please contact admin",
        location: absence.location.name,
        url: absence.lessonPlan,
        categories: [absence.subject.name],
        status: "TENTATIVE",
        organizer: {
          name: "Sistema Toronto",
          email: "sistema@uwblueprint.org",
        },
        attendees: attendees,
      };
    });

    return NextResponse.json({ status: 200, body: { events } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      status: 500,
      body: { error: "Internal Server Error" },
    });
  }
}

