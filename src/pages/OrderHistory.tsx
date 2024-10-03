import { useEffect } from "react";
import { Button, Row, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSessionStorage } from "usehooks-ts";
import { BACKEND_URL } from "../constants";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "../components/LoadingScreen";
import Navbar from "../components/Navbar";
import Table from "react-bootstrap/Table";
function OrderHistoryPage() {
  const [teamID] = useSessionStorage("teamID", null);
  const [jwt] = useSessionStorage("jwt", null);
  const nav = useNavigate();
  useEffect(() => {
    if (teamID == null) {
      nav("/");
    }
  });
  async function getHistory() {
    const resp = await fetch(
      BACKEND_URL + `?request=history&team=${teamID}&jwt=${jwt}`
    );
    const items_ = JSON.parse(await resp.text()).map((data, i) => {
      return { ...data, _position: i === 1 ? 100 : i };
    });

    return items_;
  }
  const historyQuery = useQuery({ queryKey: ["history"], queryFn: getHistory });
  return (
    <div className="page-wrapper">
      {historyQuery.isFetching && <LoadingScreen></LoadingScreen>}
      <div className="container">
        <Navbar></Navbar>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Name</th>
              <th>Credits Spent</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {historyQuery.data &&
              historyQuery.data.map((v, i) => (
                <tr key={i}>
                  <td>
                    {new Date(v.dateTime).toLocaleDateString("en-AU", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td>{v.name}</td>
                  <td>{v.creditSpent}</td>
                  <td>
                    {v.items.map((d, j) => (
                      <div key={j}>
                        {d.name} x {d.count}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        <Button
          variant="secondary"
          onClick={() => {
            nav("/shop");
          }}
        >
          Back
        </Button>
      </div>
    </div>
  );
}

export default OrderHistoryPage;
