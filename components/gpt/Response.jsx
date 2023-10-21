"use client"
import React, { useEffect, useState } from "react"
// import Loading from "../app/(Shared)/Loading.jsx"

export default function Response(props) {
    const chatLog = props.chatLog
    const loading = props.loading

    return (
        <div className="apiResponse place-content-center self-center">
            {/* {loading ? <Loading className="self-center"/> : chatLog.map((item, index) => { */}
            {chatLog.map((item, index) => {
                return (
                    <div key={index} className="flex flex-col border">
                        {item}
                    </div>
                )}
            )}
            {/* {loading && <Loading className="self-center" />} */}
        </div>
    )
}

