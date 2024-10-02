import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ShopPage from "./pages/Shop";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReviewOrdersPage from "./pages/ReviewOrders";
import OrderHistoryPage from "./pages/OrderHistory";
function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={LoginPage} />
          <Route path="/shop" Component={ShopPage} />
          <Route path="/review" Component={ReviewOrdersPage} />
          <Route path="/history" Component={OrderHistoryPage} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
