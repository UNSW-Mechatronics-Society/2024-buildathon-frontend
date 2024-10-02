import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "../constants";
import { useSessionStorage } from "usehooks-ts";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Hook that returns the credits that a team has
export function useCredits() {
  const [teamID] = useSessionStorage("teamID", null);
  const nav = useNavigate();
  useEffect(() => {
    if (teamID == null) {
      nav("/");
    }
  });
  async function getCredits() {
    const resp = await fetch(BACKEND_URL + `?request=credits&team=${teamID}`);
    const credits = JSON.parse(await resp.text());
    return credits;
  }
  const creditsQuery = useQuery({ queryKey: ["credits"], queryFn: getCredits });
  return creditsQuery;
}
