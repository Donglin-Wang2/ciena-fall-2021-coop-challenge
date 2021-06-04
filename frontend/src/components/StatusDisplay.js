import React from "react";
import { status } from "./App";

function StatusDisplay({ log, isRunning }) {
    const getLogColor = (type) => {
        let color = "";
        switch (type) {
            case status.ERROR:
                color = "has-text-danger";
                break;
            case status.WARNING:
                color = "has-text-warning";
                break;
            case status.SUCCESS:
                color = "has-text-black-bis";
                break;
            case status.RUNNING:
                color = "has-text-black-bis";
                break;
            default:
                color = "has-text-black-bis";
                break;
        }
        return color;
    };

    return (
        <article>
            <div className="message-header">
                <p>Status: {isRunning ? "Running" : "Inactive"}</p>
            </div>
            <div
                className="message-body has-background-light"
                style={{ height: "150px", overflow: "scroll" }}
            >
                {log.map((ele, idx) => (
                    <div key={idx}>
                        <p>
                            <strong className={getLogColor(ele.type)}>
                                {ele.time.toString()}
                            </strong>
                        </p>
                        <p className={getLogColor(ele.type)}>{ele.msg}</p>
                    </div>
                ))}
            </div>
        </article>
    );
}

export default StatusDisplay;
