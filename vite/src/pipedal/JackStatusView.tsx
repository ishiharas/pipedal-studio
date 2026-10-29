// Copyright (c) Robin E.R. Davies
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import React from 'react';
import { PiPedalModel, PiPedalModelFactory,State } from './PiPedalModel';
import JackHostStatus from './JackHostStatus';




interface JackStatusViewProps {
    inlineHeader?: boolean;
};

interface JackStatusViewState {
    jackStatus?: JackHostStatus;
}


export default class JackStatusView extends React.Component<JackStatusViewProps, JackStatusViewState>
{
    model: PiPedalModel;

    constructor(props: JackStatusViewProps) {
        super(props);
        this.state = {
            jackStatus: undefined
        };
        this.model = PiPedalModelFactory.getInstance();
        this.tick = this.tick.bind(this);
    }

    private waitingForTick: boolean = false;
    tick() {
        if (this.model.state.get() === State.Ready) {
            if (this.waitingForTick) return;
            this.waitingForTick = true;
            this.model.getJackStatus()
                .then(jackStatus => {
                    this.waitingForTick = false;
                    this.setState({jackStatus: jackStatus});
                })
                .catch(error => { 
                    this.waitingForTick = false;
                });
        } else {
            this.waitingForTick = false;
        }
    }

    timerHandle?: number;
    componentDidMount() {
        this.tick();
        this.timerHandle = setInterval(this.tick, 1000);
    }
    componentWillUnmount() {
        if (this.timerHandle) {
            clearTimeout(this.timerHandle);
            this.timerHandle = undefined;
        }
    }

    render() {
        const status = this.state.jackStatus;
        const cpu = status ? Math.min(100, Math.max(0, status.cpuUsage)) : 0;
        const barColor = cpu > 80 ? "#EF4444" : (cpu > 55 ? "#F59E0B" : "#00E5FF");

        const meterPill = (
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "4px 12px",
                borderRadius: 999,
                background: "rgba(11, 14, 22, 0.85)",
                border: "1px solid rgba(255, 255, 255, 0.10)",
                boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.6)",
                whiteSpace: "nowrap",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.03em",
                fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace"
            }}>
                {status && status.active && !status.restarting && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: "#94A3B8" }}>DSP</span>
                        <div style={{
                            width: 54,
                            height: 6,
                            borderRadius: 999,
                            background: "rgba(255, 255, 255, 0.10)",
                            overflow: "hidden"
                        }}>
                            <div style={{
                                width: `${cpu}%`,
                                height: "100%",
                                borderRadius: 999,
                                background: barColor,
                                boxShadow: `0 0 8px ${barColor}`,
                                transition: "width 0.3s ease"
                            }} />
                        </div>
                    </div>
                )}
                {JackHostStatus.getDisplayView("", status)}
            </div>
        );

        if (this.props.inlineHeader) {
            return meterPill;
        }

        return (
            <div style={{
                position: "absolute",
                right: 30,
                bottom: 8,
                left: 30,
                height: 28,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                pointerEvents: "none",
                zIndex: 10
            }}>
                {meterPill}
            </div>
        );

    }
}