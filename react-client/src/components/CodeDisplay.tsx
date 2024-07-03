import GraphNetListenerConsumer from "../context/GraphNetListener";
import { TextField } from "@fluentui/react/lib/TextField";

export default function CodeDisplay() {
  const { apiRequests } = GraphNetListenerConsumer();
  console.log(`this is the apiRequests ${JSON.stringify(apiRequests)}`);

  return (
    <div style={{ width: "100%", height: "100%", overflowX: "scroll" }}>
      {apiRequests.length === 0 ? (
        <div
          style={{
            fontSize: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "5px 10px",
          }}
        >
          Listening for an application call/action ...
        </div>
      ) : (
        apiRequests.map((req, curr) => (
          <div key={curr} style={{ padding: "5px 10px" }}>
            <TextField
              label="Endpoint"
              defaultValue={req.endpoint}
              multiline
              autoAdjustHeight
              readOnly
            />
            <TextField
              label="Response"
              defaultValue={req.response}
              multiline
              autoAdjustHeight
              readOnly
              style={{ overflowY: "auto" }}
            />
          </div>
        ))
      )}
    </div>
  );
}
