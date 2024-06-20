import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import Header from "../Header.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteEvent, fetchEvent, queryClient } from "../../util/http.js";

export default function EventDetails() {
  const path = useParams();
  const nav = useNavigate();

  const { data } = useQuery({
    queryKey: ["events", { id: path.id }],
    queryFn: ({ signal }) => fetchEvent({ signal, id: path.id }),
  });

  const { mutate } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      nav("/events");
    },
  });

  const handleDelete = () => {
    mutate({ id: path.id });
  };

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        <header>
          <h1>{data ? data.title : "title"}</h1>
          <nav>
            <button onClick={handleDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        {data && (
          <div id="event-details-content">
            <img src={`http://localhost:3000/${data.image}`} alt="image" />
            <div id="event-details-info">
              <div>
                <p id="event-details-location">{data.location}</p>
                <time dateTime={`Todo-DateT$Todo-Time`}>
                  {data.date} @ {data.time}
                </time>
              </div>
              <p id="event-details-description">{data.description}</p>
            </div>
          </div>
        )}
      </article>
    </>
  );
}
