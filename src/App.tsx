import React, { useState } from "react";
import DataByYear from "./components/DataByYear";
import DataByCrop from "./components/DataByCrop";
import { Switch } from "@mantine/core";

const App = () => {
  const [flag, setFlag] = useState<boolean>(false);
  return (
    <div className="container">
      <Switch
        size="xl"
        onLabel="Year Table"
        offLabel="Crop Table"
        checked={flag}
        onChange={(event) => setFlag(event.currentTarget.checked)}
      />
      {flag ? <DataByYear /> : <DataByCrop />}
    </div>
  );
};

export default App;
