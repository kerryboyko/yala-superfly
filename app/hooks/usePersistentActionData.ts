import { useState, useEffect } from "react";

import { useActionData } from "@remix-run/react";

export const usePersistentActionData = <T>(): { entry: T }[] => {
  const [dataLog, setDataLog] = useState<{ entry: T }[]>([]);
  const data = useActionData() as T;
  useEffect(() => {
    if (data) {
      setDataLog((log) => log.concat({ entry: data }));
    }
  }, [data]);
  return dataLog;
};

export default usePersistentActionData;
