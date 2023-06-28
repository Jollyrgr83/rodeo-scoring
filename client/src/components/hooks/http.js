import { useCallback, useRef, useState, useEffect } from "react";
export const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(async (url, method = "GET", body, headers = {"Content-Type": "application/json"}) => {
        setIsLoading(true);
        const httpAbortController = new AbortController();
        activeHttpRequests.current.push(httpAbortController);
        try {
            const options = {method: method, headers: headers, signal: httpAbortController.signal };

            if (method === "GET" && body !== undefined) {
                let par = "?";
                let k = Object.keys(body);
                k.forEach(key => {
                    par += key + "=" + body[key] + "&";
                });
                par = par.substring(0, par.length - 1);
                url = url + par;
            } else if (method !== "GET") {
                options.body = JSON.stringify(body);
            }
            const response = await fetch(url, options);
            const responseData = await response.json();
            /* remove activeHttpRequest upon completion */
            activeHttpRequests.current = activeHttpRequests.current.filter(reqController => reqController !== httpAbortController);
            if (!response.ok) {
                throw new Error(responseData.message);
            }
            setIsLoading(false);

            return responseData;
        } catch (er) {
            setError(er.message);
            throw er;
        }
    },[]);

    const clearError = () => setError(null);

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(a => a.abort());
        }
    }, []);

    return { isLoading, error, sendRequest, clearError };
}