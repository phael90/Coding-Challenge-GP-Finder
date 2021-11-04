import Map from "./Map/Map";

const App = () => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  return <Map apiKey={apiKey} />;
};

export default App;
