import { useEffect, useState } from "react";
import { API_URL } from "./constants";

const useFetch = (query: string) => {
  const [data, setData] = useState<undefined | string>();
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL + "/?sortby=" + query);
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(true);
      }
    };
    fetchData();
  }, [query]);
  return [data, error];
};

export default useFetch;
