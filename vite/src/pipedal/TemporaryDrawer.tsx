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

import React, { Component } from 'react';
import WithStyles from './WithStyles';
import { withStyles } from "tss-react/mui";
import {createStyles} from './WithStyles';


import IconButtonEx from './IconButtonEx';
import Drawer from '@mui/material/Drawer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Theme } from '@mui/material/styles';
import {isDarkMode} from './DarkMode';

const drawerStyles = (theme: Theme) => {
    return createStyles({
    list: {
        width: 276,
    },
    fullList: {
        width: 'auto',
    },

    drawer_header: {
        color: theme.palette.primary.main,
        background: (isDarkMode()? theme.palette.background.default: 'white'),

    }
})};

type Anchor = 'top' | 'left' | 'bottom' | 'right';

type CloseEventHandler = () => void;



interface DrawerProps extends WithStyles<typeof drawerStyles> {
    title?: string;
    position: Anchor;
    is_open: boolean;
    onClose?: CloseEventHandler;
    children?: React.ReactNode;

}
type DrawerState = {
    is_open: boolean;
}

export const TemporaryDrawer = withStyles(
    class extends Component<DrawerProps, DrawerState>
    {
        constructor(props: DrawerProps) {
            super(props);
            this.state = { is_open: props.is_open };

        }

        toggleDrawer(anchor: Anchor, open: boolean): void {
            this.setState({ is_open: open });
        };


        fireClose() {
            let handler = this.props.onClose;
            if (handler != null) {
                handler();
            }
        }

        render() {
            const classes  = withStyles.getClasses(this.props);


            return (
                <div>
                    <React.Fragment>
                        <Drawer anchor={this.props.position} open={this.props.is_open} onClose={() => { this.fireClose(); }} >
                            <div 
                                className={this.props.position === 'top' || this.props.position === 'bottom' ? classes.fullList : classes.list}
                                role="presentation"
                                onClick={() => { this.fireClose(); }}
                                onKeyDown={() => { this.fireClose(); }}
                            >
                                <div style={{
                                    display: "flex",
                                    flexFlow: "row nowrap",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    width: "100%",
                                    height: 54,
                                    paddingLeft: 8,
                                    paddingRight: 16,
                                    borderBottom: isDarkMode() ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(15, 23, 42, 0.08)",
                                    background: isDarkMode() ? "rgba(22, 28, 44, 0.75)" : "#F8FAFC"
                                }}>

                                    <IconButtonEx tooltip="Back"
                                         style={{ flex: "0 0 auto", marginRight: 6 }} >
                                        <ArrowBackIcon style={{ fill: isDarkMode() ? '#E2E8F0' : '#334155' }} />
                                    </IconButtonEx>
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        padding: "4px 12px",
                                        borderRadius: 999,
                                        background: isDarkMode() ? "rgba(0, 229, 255, 0.1)" : "rgba(2, 132, 199, 0.1)",
                                        border: isDarkMode() ? "1px solid rgba(0, 229, 255, 0.3)" : "1px solid rgba(2, 132, 199, 0.3)"
                                    }}>
                                        <span style={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: "50%",
                                            background: "#00E5FF",
                                            boxShadow: "0 0 8px #00E5FF"
                                        }} />
                                        <span style={{
                                            fontSize: "12px",
                                            fontWeight: 800,
                                            letterSpacing: "0.08em",
                                            color: isDarkMode() ? "#F8FAFC" : "#0F172A"
                                        }}>
                                            PIPEDAL STUDIO
                                        </span>
                                    </div>
                                </div>
                                {this.props.children}
                            </div>
                        </Drawer>
                    </React.Fragment>
                </div >
            );
        }
    },
    drawerStyles
);
