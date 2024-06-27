import { useState, useEffect, useContext, createContext } from "react";

interface apiItem {
  response: string;
  endpoint: string;
}

const GraphNetListenerContext = createContext<{
  apiRequests: apiItem[];
}>({
  apiRequests: [],
});

export function GraphNetListenerProvider({
  children,
}: {
  children: React.JSX.Element;
}) {
  const [apiRequests, setApiRequests] = useState<apiItem[]>([]);

  useEffect(() => {
    document.addEventListener("publishApiEvent", (e: any) => {
      const newApiItem: apiItem = {
        endpoint: e.detail.endpoint,
        response: e.detail.response,
      };
      apiRequests.push(newApiItem);
      setApiRequests([...apiRequests]);
    });
  }, []);

  return (
    <GraphNetListenerContext.Provider value={{ apiRequests }}>
      {children}
    </GraphNetListenerContext.Provider>
  );
}

export default function GraphNetListenerConsumer() {
  return useContext(GraphNetListenerContext);
}
