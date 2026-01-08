import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { getSimilarEvents } from "@/lib/actions/events.action";
import Image from "next/image";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={18} />
    <p>{label}</p>
  </div>
);
const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag) => (
      <div className="pill" key={tag}>
        {tag}
      </div>
    ))}
  </div>
);
const EventsDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const res = await fetch(`${BASE_URL}/api/events/${slug}`);
  const event = await res.json();
  const {
    _id,
    title,
    description,
    overview,
    image,
    venue,
    location,
    date,
    time,
    mode,
    audience,
    agenda,
    organizer,
    tags,
  } = event;
  let bookings = 10;
  const similarEvents: IEvent[] = await getSimilarEvents(slug);
  console.log("similar events", { ...similarEvents[0]._doc });

  if (!event) return notFound();
  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>
      <div className="details">
        {/* left side- event details */}
        <div className="content">
          <Image
            src={image}
            alt={title}
            height={800}
            width={800}
            className="banner"
          />
          <section className="flex-col gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          <section>
            <h2>Event Detail</h2>
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="calendar"
              label={date}
            />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience"
              label={audience}
            />
          </section>
          <EventAgenda agendaItems={agenda} />
          <section className="flex-col-gap-2">
            <h2>About the organizer</h2>
            <p>{organizer}</p>
          </section>
          <EventTags tags={tags} />
        </div>
        {/* right side - booking form */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <div className="text-sm">
                Join {bookings} people who already booked their spot
              </div>
            ) : (
              <div className="text-sm">Be the first to book your spot</div>
            )}
            <BookEvent />
          </div>
        </aside>
      </div>
      <div className="flex flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        {similarEvents.length > 0 &&
          similarEvents.map((similarEvent: IEvent) => (
            <EventCard key={similarEvent.title} {...similarEvent} />
          ))}
      </div>
    </section>
  );
};

export default EventsDetailsPage;
