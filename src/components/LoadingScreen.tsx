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
        zIndex: 100000,
      }}
    >
      <div className="container">
        <h2>
          Loading, please do not leave this page... (this may take a few
          seconds)
        </h2>
        <p>
          In case you wanted to know why, we want to provide you the latest
          stock infomation and as such will try to fetch when the page is active
          again. If you alt-tab, another refetch will commence and you may need
          to wait longer. Why are you still reading this?
        </p>
      </div>
    </div>
  );
}

export default LoadingScreen;
