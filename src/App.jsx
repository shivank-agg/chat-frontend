import JoinCreateChat from "./components/JoinCreateChat";
import { BASE_URL } from "./config/AxiosHelper";

function App() {
  console.log("Backend URL:", BASE_URL);
  return (
    <div>
      <JoinCreateChat />
    </div>
  );
}

export default App;
