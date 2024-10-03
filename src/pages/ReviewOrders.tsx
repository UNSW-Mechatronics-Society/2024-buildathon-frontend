import { useMemo } from "react";
import { Button, Stack } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useCredits } from "../hooks/useCredits";
import { useSessionStorage } from "usehooks-ts";
import { BACKEND_URL } from "../constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingScreen from "../components/LoadingScreen";

function ReviewOrdersPage() {
  const { state } = useLocation();
  const [zID] = useSessionStorage("zID", null);
  const [name] = useSessionStorage("name", null);
  const [teamID] = useSessionStorage("teamID", null);
  const [jwt] = useSessionStorage("jwt", null);
  const nav = useNavigate();

  const items = useMemo(() => {
    return state.items.filter((v) => v.count > 0);
  }, [state.items]);

  const queryClient = useQueryClient();

  const creditsQuery = useCredits();

  const remainingCredits = useMemo(() => {
    return (
      creditsQuery.data -
      items.reduce((prev, cur) => prev + cur.count * cur.points, 0)
    );
  }, [creditsQuery.data, items]);

  function onPurchase() {
    if (remainingCredits < 0 || isNaN(remainingCredits)) {
      alert("Insufficient Credits.");
      nav("/shop");
    } else if (items.length === 0) {
      alert("Add items to your cart.");
      nav("/shop");
    } else {
      purchase.mutate();
    }
  }

  async function onPurchaseMutation() {
    return JSON.parse(
      await (
        await fetch(BACKEND_URL, {
          redirect: "follow",
          method: "POST",
          body: JSON.stringify({
            request: "purchase",
            teamID,
            name,
            zID,
            orders: items,
            jwt,
          }),
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
        })
      ).text()
    );
  }

  const purchase = useMutation({
    mutationFn: onPurchaseMutation,
    onSuccess: (res) => {
      console.log(res);

      if (res.status === "SUCCESS") {
        alert("Purchase Success.");
      } else {
        alert(res.msg);
      }
      queryClient.invalidateQueries({ queryKey: ["credits"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
      nav("/history");
    },

    onError: (res) => {
      alert(res.message);
      nav("/history");
    },
  });

  return (
    <div className="page-wrapper">
      {(creditsQuery.isFetching || purchase.isPending) && (
        <LoadingScreen></LoadingScreen>
      )}
      <div className="container">
        <h1>Order Review</h1>

        <Stack>
          {items.map((item, index) => (
            <p key={index}>
              {item.name} x {item.count} = {item.count * item.points}
            </p>
          ))}
          <p
            className="font-weight-bold"
            style={{ color: remainingCredits > 0 ? "darkblue" : "red" }}
          >
            Remaining Credits: {remainingCredits}
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Button
              variant="secondary"
              onClick={() => {
                nav("/shop");
              }}
            >
              Back
            </Button>
            <Button
              disabled={
                remainingCredits < 0 ||
                isNaN(remainingCredits) ||
                items.length === 0
              }
              onClick={onPurchase}
            >
              Purchase
            </Button>
          </div>
        </Stack>
      </div>
    </div>
  );
}

export default ReviewOrdersPage;
