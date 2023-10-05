import { DataBaseURL } from "../../../constants";

export default function getDecks() {
    return fetch(`${DataBaseURL}decks.json`)
      .then((res) => {
        if (!res.ok) {
          throw Error();
        }
        return res.json();
      })
      .then((res) => res)
      .catch((err) => console.log(err));
}