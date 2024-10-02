import { useMutation } from "@tanstack/react-query";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useSessionStorage } from "usehooks-ts";
import { BACKEND_URL } from "../constants";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoadingScreen from "../components/LoadingScreen";

function LoginPage() {
  const [zID, setZID] = useSessionStorage("zID", null);
  const [name, setName] = useSessionStorage("name", null);
  const [teamID, setTeamID] = useSessionStorage("teamID", null);
  const nav = useNavigate();
  async function login(zID) {
    return JSON.parse(
      await (
        await fetch(BACKEND_URL, {
          redirect: "follow",
          method: "POST",
          body: JSON.stringify({ request: "auth", zID }),
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
        })
      ).text()
    );
  }

  const post = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      setZID(res.zID);
      setName(res.name);
      setTeamID(res.teamID);
      nav("/shop");
    },
    onError: () => {
      alert("Invalid zID, if problem persists, please contact organisers.");
    },
  });

  function onFormSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    post.mutate(e.currentTarget.elements["inputZID"].value);
  }

  return (
    <div className="container">
      {post.isPending &&<LoadingScreen></LoadingScreen>}
      <Navbar></Navbar>
      <h1>Enter Your zID (including the z)</h1>
      <Form onSubmit={onFormSubmit}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="inputZID">zID</Form.Label>
          <Form.Control
            type="text"
            id="inputZID"
            aria-describedby="zIdHelpBlock"
          />
          <Form.Text id="zIdHelpBlock" muted>
            Please enter your zID including the 'z'. It must not contain any
            spaces, special characters or emojis.
          </Form.Text>
        </Form.Group>
        <Button type="submit">Submit form</Button>
      </Form>
    </div>
  );
}

export default LoginPage;
