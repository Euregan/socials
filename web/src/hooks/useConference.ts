import { use, useState } from "react";
import enodia from "../api";

const api = enodia(`${import.meta.env.VITE_API_URL}/graphql`);

const call = api.query
  .conferences([
    "id",
    "name",
    {
      editions: [
        "id",
        "name",
        "participantCount",
        "speakerCount",
        "everyoneCount",
      ],
    },
  ])
  .catch(() => []);

export const useConference = () => {
  const conferences = use(call);

  const [conference, setConference] = useState(conferences[0]);

  return {
    conference,
  };
};
