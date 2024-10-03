import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "../constants";
import { useSessionStorage } from "usehooks-ts";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Hook that returns the credits that a team has
export function useItems() {
  const [teamID] = useSessionStorage("teamID", null);
  const [jwt] = useSessionStorage("jwt", null);
  const nav = useNavigate();
  useEffect(() => {
    if (teamID == null || jwt == null) {
      nav("/");
    }
  });
  async function getItems() {
    const resp = await fetch(BACKEND_URL + `?request=items&jwt=${jwt}`);
    const items_ = JSON.parse(await resp.text()).map((data, i) => {
      return { ...data, _position: i === 1 ? 100 : i };
    });

    return items_;
  }
  const itemsQuery = useQuery({ queryKey: ["items"], queryFn: getItems });
  return itemsQuery;
}
