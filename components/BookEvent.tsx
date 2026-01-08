"use client";
import { createBooking } from "@/lib/actions/booking.action";
import { useState } from "react";

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { success } = await createBooking({ eventId, slug, email });
    if (success) {
      setSubmitted(true);
    } else {
      console.log("booking failed error:");
    }
  };
  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for submitting.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
            />
          </div>
          <button type="submit" className="button-submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
