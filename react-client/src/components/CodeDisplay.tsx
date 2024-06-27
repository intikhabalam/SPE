import GraphNetListenerConsumer from "../context/GraphNetListener";

export default function CodeDisplay() {
  const { apiRequests } = GraphNetListenerConsumer();
  console.log(`this is the apiRequests ${JSON.stringify(apiRequests)}`);
  return (
    <div style={{ width: "100%", height: "100%", overflowX: "scroll" }}>
      {apiRequests.map((req, curr) => {
        return (
          <div>
            <p>{req.endpoint}</p>
            <p
              style={{
                wordBreak: "break-all",
                whiteSpace: "normal",
              }}
            >
              {req.response}
            </p>
          </div>
        );
      })}
    </div>
  );
}
