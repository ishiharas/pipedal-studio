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

import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import VirtualKeyboardHandler from './VirtualKeyboardHandler';
import AppThemed from "./AppThemed";
import { isDarkMode } from './DarkMode';
import Tone3000AuthComplete from './Tone3000AuthComplete';
import FontTest from './FontTest';

import IconTest from './IconTest';

declare module '@mui/material/styles' {
    interface Theme {
        mainBackground: React.CSSProperties['color'];
        toolbarColor: React.CSSProperties['color'];
    }
    interface ThemeOptions {
        mainBackground?: React.CSSProperties['color'];
        toolbarColor?: React.CSSProperties['color'];
    }
    interface Palette {
        actionBar: Palette['primary'];
    }
    interface PaletteOptions {
        actionBar: PaletteOptions['primary'];
    }

}

declare module '@mui/material/Button' {
    interface ButtonPropsVariantOverrides {
        dialogPrimary: true;
        dialogSecondary: true;
    }
}


// declare module '@mui/styles/defaultTheme' {
//     // eslint-disable-next-line @typescript-eslint/no-empty-interface
//     interface DefaultTheme extends Theme { }
// }




const theme = createTheme(
    isDarkMode() ?
        {
            cssVariables: true,
            components: {
                // MuiTouchRipple: {
                //     styleOverrides: {
                //         root: {
                //             borderRadius: 'inherit',
                //             overflow: 'hidden',
                //         },
                //         ripple: {
                //             color: '#F88 !important',
                //             borderRadius: 'inherit',

                //             '&.MuiTouchRipple-ripplePulsate': {
                //                 //animation: 'none !important',

                //                 // Make focus ripple fill the entire button
                //                 '&.MuiTouchRipple-child': {
                //                     width: '100%',
                //                     height: '100%',
                //                     borderRadius: 'inherit',
                //                     transform: 'scale(1.4)', // Override the default scaling
                //                 }
                //             },
                //             '&.MuiTouchRipple-ripple': {
                //                 '&:focus': {
                //                     // Make focus ripple fill the entire button
                //                     transform: 'scale(1.4)',
                //                     width: '100%',
                //                     height: '100%',
                //                     color: '#F88',
                //                     borderRadius: 'inherit',
                //                 },
                //             },
                //         },
                //         child: {
                //             borderRadius: 'inherit',
                //         }
                //     }
                // },
                MuiPaper: {
                    styleOverrides: {
                        root: {
                            backgroundImage: 'none',
                            backgroundColor: '#121723',
                            color: '#F1F5F9',
                        },
                        rounded: {
                            borderRadius: 14,
                        }
                    }
                },
                MuiBackdrop: {
                    styleOverrides: {
                        root: {
                            backgroundColor: 'rgba(6, 9, 15, 0.72)',
                            backdropFilter: 'blur(4px)',
                        },
                        invisible: {
                            backgroundColor: 'transparent',
                            backdropFilter: 'none',
                        }
                    }
                },
                MuiDialog: {
                    styleOverrides: {
                        paper: {
                            backgroundImage: 'none',
                            background: 'linear-gradient(180deg, #161C2C 0%, #0E121C 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.11)',
                            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75)',
                            borderRadius: 16,
                        },
                        paperFullScreen: {
                            backgroundImage: 'none',
                            background: 'linear-gradient(180deg, #131826 0%, #0B0D14 100%)',
                            border: 'none',
                            borderRadius: 0,
                        }
                    }
                },
                MuiDialogTitle: {
                    styleOverrides: {
                        root: {
                            background: 'rgba(22, 28, 44, 0.92)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                            fontWeight: 700,
                            letterSpacing: '0.01em',
                        }
                    }
                },
                MuiDialogActions: {
                    styleOverrides: {
                        root: {
                            borderTop: '1px solid rgba(255, 255, 255, 0.07)',
                            padding: '10px 18px',
                        }
                    }
                },
                MuiDrawer: {
                    styleOverrides: {
                        paper: {
                            backgroundImage: 'none',
                            background: 'linear-gradient(180deg, #141A29 0%, #0C0F18 100%)',
                            borderRight: '1px solid rgba(255, 255, 255, 0.10)',
                            boxShadow: '12px 0 36px rgba(0, 0, 0, 0.65)',
                        }
                    }
                },
                MuiAppBar: {
                    styleOverrides: {
                        root: {
                            backgroundImage: 'none',
                            background: 'linear-gradient(180deg, #161C2C 0%, #0E121D 100%)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                            color: '#F8FAFC',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.45)',
                        }
                    }
                },
                MuiMenu: {
                    styleOverrides: {
                        paper: {
                            backgroundImage: 'none',
                            background: '#161C2B',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: 12,
                            boxShadow: '0 14px 36px rgba(0, 0, 0, 0.65)',
                            padding: '4px',
                        }
                    }
                },
                MuiMenuItem: {
                    styleOverrides: {
                        root: {
                            borderRadius: 8,
                            margin: '2px 4px',
                            fontSize: '0.88rem',
                            fontWeight: 500,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.07)',
                            },
                            '&.Mui-selected': {
                                backgroundColor: 'rgba(0, 229, 255, 0.15)',
                                color: '#00E5FF',
                                fontWeight: 700,
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 229, 255, 0.22)',
                                },
                            },
                        }
                    }
                },
                MuiListItemButton: {
                    styleOverrides: {
                        root: {
                            borderRadius: 10,
                            margin: '2px 10px',
                            paddingTop: 8,
                            paddingBottom: 8,
                            transition: 'all 0.14s ease',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                            },
                            '&.Mui-selected': {
                                backgroundColor: 'rgba(0, 229, 255, 0.14)',
                                border: '1px solid rgba(0, 229, 255, 0.35)',
                                color: '#F8FAFC',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 229, 255, 0.20)',
                                },
                            },
                        }
                    }
                },
                MuiDivider: {
                    styleOverrides: {
                        root: {
                            borderColor: 'rgba(255, 255, 255, 0.08)',
                        }
                    }
                },
                MuiButton: {
                    styleOverrides: {
                        root: {
                            '& .MuiTouchRipple-ripple': {
                                transform: 'scale(1.9)',
                            }
                        },
                        containedPrimary: {
                            borderRadius: '9999px',
                            paddingLeft: "16px", paddingRight: "16px",
                            textTransform: "none",
                            fontWeight: 700
                        },
                        containedSecondary: {
                            borderRadius: '9999px',
                            paddingLeft: "16px", paddingRight: "16px",
                            textTransform: "none",
                            fontWeight: 700
                        }

                    },
                    variants: [
                        {
                            props: { variant: 'dialogPrimary' },
                            style: {
                                color: "#00E5FF",
                                fontWeight: 700,
                                textTransform: "none",
                                borderRadius: 999
                            }
                        },
                        {
                            props: { variant: 'dialogSecondary', },
                            style: {
                                color: "#94A3B8",
                                fontWeight: 600,
                                textTransform: "none",
                                borderRadius: 999
                            },
                        },
                    ],
                },
            },

            palette: {
                mode: 'dark',
                primary: {
                    main: '#00E5FF'
                },
                secondary: {
                    main: "#FF3864"
                },
                background: {
                    default: "#0B0D13",
                    paper: "#121723"
                },
                actionBar: {
                    main: '#0B0E17',
                    contrastText: '#F8FAFC'
                }

            },
            mainBackground: "#0E121B",
            toolbarColor: '#0E121B'
        }
        :
        {
            cssVariables: true,
            components: {
                /* make the selection state for MuiListItemButtons a smidgen darker (light theme only) */
                MuiListItemButton: {
                    styleOverrides: {
                        root: ({ theme }) => ({
                            '&.Mui-selected': {
                                backgroundColor: 'rgba(0, 0, 0, 0.2)', // Adjust for desired darkness
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.25)', // Slightly darker on hover
                                },
                            },
                        }),
                    },
                },
                MuiButton: {
                    styleOverrides: {
                        root: {
                            '& .MuiTouchRipple-root': {
                                borderRadius: 'inherit',
                            },
                            '& .MuiTouchRipple-ripple': {
                                transform: 'scale(1.9)!important',
                            }
                        },
                        containedPrimary: {
                            borderRadius: '9999px',
                            paddingLeft: "16px", paddingRight: "16px",
                            textTransform: "none"
                        },
                        containedSecondary: {
                            borderRadius: '9999px',
                            paddingLeft: "16px", paddingRight: "16px",
                            textTransform: "none"
                        }

                    },
                    variants: [
                        {
                            props: { variant: 'dialogPrimary' },
                            style: {
                                color: "rgb(0,0,0,0.87)"
                            }
                        },
                        {
                            props: { variant: 'dialogSecondary', },
                            style: {
                                color: "rgb(0,0,0,0.6)"
                            },
                        },
                    ],
                },
            },
            palette: {
                primary: {
                    main: "#6750A4"   // #5B5690  #60529A  #5C5694
                },
                secondary: {
                    main: "#FF6060"
                },
                actionBar: {
                    main: '#130b22ff',
                    contrastText: '#FFFFFF'
                }



            },
            mainBackground: "#FFFFFF",
            toolbarColor: '#FFFFFF'


        }
);



type AppThemeProps = {

};


function isTone3000Auth() {
    let url = new URL(window.location.href);
    let param = url.searchParams.get("api_key");
    return (param !== null && param !== "")
}
function isFontTest() {
    let url = new URL(window.location.href);
    let param = url.searchParams.get("fontTest");
    return (param !== null)
}
function isIconTest() {
    let url = new URL(window.location.href);
    let param = url.searchParams.get("iconTest");
    return (param !== null)
}

const App = (class extends React.Component {
    // Before the component mounts, we initialise our state

    constructor(props: AppThemeProps) {
        super(props);
        this.state = {
        };
        if (!App.virtualKeyboardHandler) {
            App.virtualKeyboardHandler = new VirtualKeyboardHandler();
        }
    }

    static virtualKeyboardHandler?: VirtualKeyboardHandler;

    render() {
        return (
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {
                        isTone3000Auth() && (<Tone3000AuthComplete />)
                        || isFontTest() && (<FontTest />)
                        || isIconTest() && (<IconTest />)
                        || (<AppThemed />)
                    }
                </ThemeProvider>
            </StyledEngineProvider>
        );
    }
}
);

export default App;
