import { useEffect, useRef, useState } from "react";
import { useSessionStorage } from "usehooks-ts";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "../constants";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useCredits } from "../hooks/useCredits";
import { useItems } from "../hooks/useItems";
import Navbar from "../components/Navbar";
import LoadingScreen from "../components/LoadingScreen";

function ShopCard({ itemsData, teamCredits, ordersData, onChange }) {
  const [count, setCount] = useState(0);
  const remainingStock = itemsData.stock - ordersData.ordered;

  const remainingCap = itemsData.cap - ordersData.ordered;

  const maxAffordable = Math.floor(teamCredits / itemsData.points);

  useEffect(() => {
    onChange(itemsData.name, { ...itemsData, count });
  }, [count]);

  // Calculate the max count by taking the minimum of remaining stock, remaining cap, and max affordable
  const maxCount = Math.max(Math.min(remainingStock, remainingCap, maxAffordable), 0);
  return (
    <Card
      key={itemsData.id}
      style={{
        position: "relative",
        padding: "1rem",
        height: "100%",
        opacity: `${(maxCount === 0 && itemsData.id != 1) ? 0.6 : 1}`,
      }}
      className="text-center"
    >
      {itemsData.id !== 1 && (
        <div className="stock-card">
          <span>Stock: </span>
          <span>{itemsData.stock}</span>
        </div>
      )}

      <Card.Img
        variant="top"
        style={{ height: "9rem", width: "9rem", margin: "0 auto" }}
        src={`/items/${itemsData.id}.png`}
        alt={itemsData.name}
      />
      <Card.Body>
        <Card.Title>{itemsData.name}</Card.Title>
        <Card.Text>{itemsData.desc}</Card.Text>
      </Card.Body>
      <Card.Text>Credit Cost: {itemsData.points}</Card.Text>
      {itemsData.id !== 1 ? (
        <div className="card-btn-section">
          <Button
            variant="primary"
            id={`minus-${itemsData.id}`}
            disabled={maxCount === 0}
            onClick={() => {
              setCount(Math.max(count - 1, 0));
            }}
          >
            -
          </Button>
          <input
            type="number"
            id={`item-${itemsData.id}`}
            min={0}
            max={maxCount}
            value={count}
            disabled={maxCount === 0}
            onChange={(e) => {
              const clampedVal = Math.min(
                Math.max(Number(e.currentTarget.value), 0),
                maxCount
              );
              setCount(clampedVal);
            }}
          />
          <Button
            variant="primary"
            id={`plus-${itemsData.id}`}
            disabled={maxCount === 0}
            onClick={() => {
              setCount(Math.min(count + 1, maxCount));
            }}
          >
            +
          </Button>
        </div>
      ) : (
        <p className="card-text">
          <span>If you have 3D printed components, please fill out the </span>
          <a href="https://forms.gle/hoTTFTypBCNnS43y8" target="_blank">
            Google Form
          </a>
          <span> to verify its weight and process credits.</span>
        </p>
      )}
    </Card>
  );
}

function ShopPage() {
  const [teamID] = useSessionStorage("teamID", null);
  const nav = useNavigate();
  const ordersPending = useRef(new Map<string, number>());

  async function getOrders() {
    const resp = await fetch(BACKEND_URL + `?request=ordered&team=${teamID}`);
    const orders = JSON.parse(await resp.text());
    return orders;
  }

  const itemsQuery = useItems();
  const creditsQuery = useCredits();
  const ordersQuery = useQuery({ queryKey: ["orders"], queryFn: getOrders });

  function onOrderPendingChange(key: string, value: number) {
    ordersPending.current.set(key, value);
  }

  function onReview() {
    nav("/review", {
      state: { items: [...ordersPending.current.values()] },
    });
  }

  return (
    <div className="page">
      {(itemsQuery.isFetching || creditsQuery.isFetching || ordersQuery.isFetching) && <LoadingScreen></LoadingScreen>}
      <div className="credits-box">
        <span>Current Credits:</span>
        <span className="font-weight-bold">{creditsQuery.data}</span>
      </div>
      <div className="container">
        <Navbar></Navbar>
        <h1>Hello Team {teamID}</h1>
        <Container>
          <Row xs={1} md={2} lg={3} style={{ rowGap: "2rem" }}>
            {ordersQuery.data &&
              creditsQuery.data &&
              itemsQuery.data
                ?.sort((a, b) => {
                  return a._position - b._position;
                })
                .map((v) => (
                  <Col key={v.id}>
                    <ShopCard
                      teamCredits={creditsQuery.data}
                      ordersData={ordersQuery.data.find(
                        (o) => o.name === v.name
                      )}
                      itemsData={v}
                      onChange={onOrderPendingChange}
                    ></ShopCard>
                  </Col>
                ))}
          </Row>
          <Row className="mt-4">
            <div className="card card-grid1">
              <div className="card-body">
                <h5 className="card-title">External Component</h5>
                <p>
                  If you need external components, please fill out the{" "}
                  <a href="https://forms.gle/KEvzeyYgLST1wFZc9" target="_blank">
                    Google Form
                  </a>
                  .
                </p>
              </div>
            </div>
          </Row>
          <Row className="mt-4">
            <Button onClick={onReview}>Review Order</Button>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default ShopPage;
