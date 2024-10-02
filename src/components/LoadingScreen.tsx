function LoadingScreen() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "fixed",
        top: "0px",
        left: "0",
        background: "white",
        opacity: 0.95,
        zIndex:100000
      }}
    >
      <div className="container">
        <h2>Loading... (this may take a few seconds)</h2>
      </div>
    </div>
  );
}

export default LoadingScreen;
