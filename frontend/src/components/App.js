import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import axios from "axios";
import Plot from "react-plotly.js";
import useInterval from "../hooks/useInterval";
import StatusDisplay from "./StatusDisplay";

const MIN_LIMIT_EXCL = 1515;
const MAX_LIMIT_EXCL = 1580;
const status = {
    ERROR: "error",
    WARNING: "warning",
    SUCCESS: "success",
    RUNNING: "running",
};

function App() {
    const [xdata, setXData] = useState(null);
    const [ydata, setYData] = useState(null);
    const [lower, setLower] = useState(MIN_LIMIT_EXCL + 1);
    const [upper, setUpper] = useState(MAX_LIMIT_EXCL - 1);
    const [query, setQuery] = useState("");
    const [isRunning, setRunning] = useState(false);
    const [msg, setMsg] = useState([]);
    const [log, setLog] = useState([]);

    const getSingleTrace = () => {
        axios
            .get("/api/trace")
            .then((res) => {
                const newLog = {
                    type: status.SUCCESS,
                    msg: "Successfully fetched from API",
                    time: new Date(),
                };
                setLog([...log, newLog]);
                if (res.data.xdata.length === 0) {
                    const newLog = {
                        type: status.WARNING,
                        msg: "No data is returned from the device. Try changing the scan limit.",
                        time: new Date(),
                    };
                    setLog([...log, newLog]);
                }
                setXData(res.data.xdata);
                setYData(res.data.ydata);
            })
            .catch((err) => {
                const newLog = {
                    type: status.ERROR,
                    msg: err.response.data.msg,
                    time: new Date(),
                };
                setLog([...log, newLog]);
            });
    };
    const sendQuery = () => {
        axios
            .post("/api/query", { query: query })
            .then((res) => {
                const newLog = {
                    type: status.SUCCESS,
                    msg: "Successfully received a response to the query",
                    time: new Date(),
                };
                setLog([...log, newLog]);
                const newMsg = {
                    type: status.SUCCESS,
                    msg: `The device responded "${res.data}"`,
                };
                setMsg([...msg, newMsg]);
                setQuery("");
            })
            .catch((err) => console.log(err));
        
    };
    const setLimit = () => {
        if (lower >= upper) {
            const newMsg = {
                type: status.ERROR,
                msg: "Lower limit must be greater than upper limit!",
            };
            setMsg([...msg, newMsg]);
            return;
        }
        if (
            lower <= MIN_LIMIT_EXCL ||
            lower >= MAX_LIMIT_EXCL ||
            upper <= MIN_LIMIT_EXCL ||
            upper >= MAX_LIMIT_EXCL
        ) {
            const newMsg = {
                type: status.ERROR,
                msg: "Limits must be between 1515 and 1580, exclusive on both sides!",
            };
            setMsg([...msg, newMsg]);
        }
        axios
            .post("/api/limit", { limit: [lower, upper] })
            .then((res) => {
                const newLog = {
                    type: status.SUCCESS,
                    msg: "Successfully set the OSA limit",
                    time: new Date(),
                };
                setLog([...log, newLog]);
            })
            .catch((err) => {
                const newLog = {
                    type: status.ERROR,
                    msg: err.response.data.msg,
                    time: new Date(),
                };
                setLog([...log, newLog]);
            });
    };
    const getLimit = () => {
        axios
            .get("/api/limit")
            .then((res) => {
                const newLog = {
                    type: status.SUCCESS,
                    msg: "Successfully fetched the limit of the device",
                    time: new Date(),
                };
                const newMsg = {
                    type: status.SUCCESS,
                    msg: `The limits are: [${res.data.limit[0]}, ${res.data.limit[1]}]`,
                };
                setMsg([...msg, newMsg]);
                setLog([...log, newLog]);
            })
            .catch((err) => {
                const newLog = {
                    type: status.ERROR,
                    msg: err.response.data.msg,
                    time: new Date(),
                };
                setLog([...log, newLog]);
            });
    };
    const startSimulation = () => {
        setRunning(true);
    };
    const endSimulation = () => {
        setRunning(false);
    };
    const removeError = (key) => {
        const newArray = [...msg];
        newArray.splice(key, 1);
        setMsg(newArray);
    };
    const getMsgDisplay = () => {
        return msg.map((ele, idx) => {
            if (ele.type == status.ERROR) {
                return (
                    <div key={idx} className="notification is-danger mb-1 mt-1">
                        <button
                            className="delete"
                            onClick={removeError}
                        ></button>
                        <strong>Error: </strong> {ele.msg}
                    </div>
                );
            } else if (ele.type == status.SUCCESS) {
                return (
                    <div
                        key={idx}
                        className="notification is-success mb-1 mt-1"
                    >
                        <button
                            className="delete"
                            onClick={removeError}
                        ></button>
                        {ele.msg}
                    </div>
                );
            }
        });
    };

    useInterval(() => {
        if (isRunning) {
            getSingleTrace();
        }
    }, 1000);

    return (
        <div>
            <nav className="navbar is-success">
                <div className="navbar-start">
                    <div className="buttons">
                        {isRunning ? (
                            <button
                                className="button is-rounded is-light is-success navbar-item"
                                onClick={startSimulation}
                                disabled
                            >
                                <strong>Start</strong>
                            </button>
                        ) : (
                            <button
                                className="button is-rounded is-light is-success navbar-item"
                                onClick={startSimulation}
                            >
                                <strong>Start</strong>
                            </button>
                        )}
                        {isRunning ? (
                            <button
                                className="button is-rounded is-light is-success navbar-item"
                                onClick={endSimulation}
                            >
                                <strong>Stop</strong>
                            </button>
                        ) : (
                            <button
                                className="button is-rounded is-light is-success navbar-item"
                                onClick={endSimulation}
                                disabled
                            >
                                <strong>Stop</strong>
                            </button>
                        )}

                        <button
                            className="button is-rounded is-light is-success navbar-item"
                            onClick={getSingleTrace}
                        >
                            <strong>Single</strong>
                        </button>
                    </div>
                </div>
                <div className="navbar-end">
                    <div className="navbar-item">
                        <input
                            className="input is-info"
                            type="text"
                            placeholder="Query"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button
                            className="button is-rounded is-light is-success"
                            onClick={sendQuery}
                        >
                            <strong>Send Query</strong>
                        </button>
                    </div>
                    <div className="navbar-item">
                        <input
                            className="input is-info"
                            type="number"
                            placeholder="Lower Limit"
                            value={lower}
                            onChange={(e) => setLower(parseInt(e.target.value))}
                        />
                        <input
                            className="input is-info ml-1"
                            type="number"
                            placeholder="Uppder Limit"
                            value={upper}
                            onChange={(e) => setUpper(parseInt(e.target.value))}
                        />
                        <button
                            className="button is-rounded is-light is-success"
                            onClick={getLimit}
                        >
                            <strong>Get Limit</strong>
                        </button>
                        <button
                            className="button is-rounded is-light is-success ml-1"
                            onClick={setLimit}
                        >
                            <strong>Set Limit</strong>
                        </button>
                    </div>
                </div>
            </nav>
            {getMsgDisplay()}
            <StatusDisplay log={log} isRunning={isRunning} />
            <div className="container">
                <Plot
                    data={[
                        {
                            x: xdata,
                            y: ydata,
                            type: "scatter",
                            mode: "lines+markers",
                            marker: { color: "red" },
                        },
                    ]}
                    layout={{
                        xaxis: {
                            title: "m",
                            autorange: true,
                            range: ["1.511e-06", "1.580e-06"]
                        }, 
                        yaxis: {
                            title: "dBm",
                            autorange: true,
                            range: [-80, -30]
                        }
                    }}
                    useResizeHandler={true}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                />
            </div>
        </div>
    );
}

ReactDom.render(<App />, document.getElementById("app"));
export { status };
