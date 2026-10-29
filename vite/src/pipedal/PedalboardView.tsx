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

import React, { ReactNode, Component, SyntheticEvent } from 'react';
import { css } from '@emotion/react';
import { createStyles } from './WithStyles';

import WithStyles, { withTheme } from './WithStyles';
import { withStyles } from "tss-react/mui";


import { Theme } from '@mui/material/styles';
import { PiPedalModel, PiPedalModelFactory } from './PiPedalModel';
import { PluginType } from './Lv2Plugin';
import ButtonBase from '@mui/material/ButtonBase';
import PluginIcon, { getIconColor, getPluginCategoryInfo, renderHardwareIllustration, SelectIconUri } from './PluginIcon';
import { SelectHoverBackground } from './SelectHoverBackground';
import SvgPathBuilder from './SvgPathBuilder';
import Draggable from './Draggable'
import Rect from './Rect';
import { PiPedalStateError } from './PiPedalError';
import Utility from './Utility';
import { isDarkMode } from './DarkMode';
import {
    Pedalboard, PedalboardItem, PedalboardSplitItem, SplitType
} from './Pedalboard';

// import MidiIcon from './svg/ic_midi.svg?react';
// import { midiChannelBindingControlFeatureEnabled } from './MidiChannelBinding';
// import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const START_CONTROL = Pedalboard.START_CONTROL_ID;
const END_CONTROL = Pedalboard.END_CONTROL_ID;


const START_PEDALBOARD_ITEM_URI = Pedalboard.START_PEDALBOARD_ITEM_URI;
const END_PEDALBOARD_ITEM_URI = Pedalboard.END_PEDALBOARD_ITEM_URI;

const ENABLED_CONNECTOR_COLOR = isDarkMode() ? "#00E5FF" : "#0284C7";
const DISABLED_CONNECTOR_COLOR = isDarkMode() ? "#2A3246" : "#CBD5E1";



const CELL_WIDTH: number = 142;
const CELL_HEIGHT: number = 114;
const FRAME_SIZE: number = 74;
const CARD_WIDTH: number = 120;
const CARD_HEIGHT: number = 98;

const STROKE_WIDTH = 3;
const STEREO_STROKE_WIDTH = 7;


const I_SVG_STROKE_WIDTH = 3;
const I_SVG_STEREO_STROKE_WIDTH = 7;

const SVG_STROKE_WIDTH = I_SVG_STROKE_WIDTH.toString();
const SVG_STEREO_STROKE_WIDTH = I_SVG_STEREO_STROKE_WIDTH.toString();



const EMPTY_ICON_URL = "img/fx_empty.svg";
const ERROR_ICON_URL = "img/fx_error.svg";
const TERMINAL_ICON_URL = "img/fx_terminal.svg";

function CalculateConnection(numberOfInputs: number, numberOfOutputs: number) {
    if (numberOfInputs === 0) {
        return numberOfOutputs;
    }
    if (numberOfOutputs === 0) {
        return numberOfInputs;
    }
    let result = Math.min(numberOfInputs, numberOfOutputs);
    if (result > 2) result = 2;
    return result;
}

const pedalboardStyles = (theme: Theme) => createStyles({
    scrollContainer: css({
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }),

    container: css({
        position: "absolute",
        overflow: "visible",
        flex: "0 0 auto"
    }),
    splitItem: css({
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",


        width: CELL_WIDTH,
        height: CELL_HEIGHT

    }),
    splitStart: css({
        position: "absolute",
        display: "flex",
        width: CELL_WIDTH,
        height: CELL_HEIGHT,
        left: 0,
        top: 0
    }),
    splitEnd: css({
        position: "absolute",
        display: "flex",
        width: CELL_WIDTH,
        height: CELL_HEIGHT,
        right: 0,
        top: 0
    }),
    buttonDraggable: css({
        display: "flex",
        alignItem: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%"
    }),
    pedalItem: css({
        position: "absolute",
        width: CELL_WIDTH,
        height: CELL_HEIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }),
    midiConnectorDecoration: css({
        position: "absolute",
        left: -20,
        top: -6,
        fill: theme.palette.text.secondary
    }),

    pedalButton: css({

        position: "relative",

        marginLeft: (CELL_WIDTH - CARD_WIDTH) / 2,
        marginRight: (CELL_WIDTH - CARD_WIDTH) / 2,
        marginTop: (CELL_HEIGHT - CARD_HEIGHT) / 2,
        marginBottom: (CELL_HEIGHT - CARD_HEIGHT) / 2,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        padding: 0,
        borderRadius: 12
    }),

    iconFrame: css({

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background: isDarkMode()
            ? "linear-gradient(180deg, #1E2433 0%, #131722 100%)"
            : "linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)",

        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderColor: isDarkMode() ? "rgba(255, 255, 255, 0.14)" : "rgba(15, 23, 42, 0.18)",
        borderWidth: 1.5,
        borderStyle: "solid",
        overflow: "hidden",
        padding: 0,
        borderRadius: 12,
        boxShadow: isDarkMode()
            ? "0 6px 16px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.08)"
            : "0 4px 12px rgba(15, 23, 42, 0.10)"
    }),
    selectedIconFrame: css({

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background: isDarkMode()
            ? "linear-gradient(180deg, #252D40 0%, #171C29 100%)"
            : "linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 100%)",
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderColor: "#00E5FF",
        borderWidth: "2px",
        borderStyle: "solid",
        overflow: "hidden",
        borderRadius: 12,
        boxShadow: "0 0 16px 1px rgba(0, 229, 255, 0.45), 0 8px 20px rgba(0, 0, 0, 0.65)"
    }),
    borderlessIconFrame: css({

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        background: isDarkMode()
            ? "radial-gradient(circle, rgba(30, 36, 51, 0.95) 0%, rgba(15, 18, 26, 0.95) 100%)"
            : "rgba(241, 245, 249, 0.9)",
        width: 56,
        height: 56,
        border: isDarkMode() ? "1.5px rgba(0, 229, 255, 0.35) solid" : "1.5px #94A3B8 solid",
        borderRadius: 28,
        overflow: "hidden",
        boxShadow: isDarkMode() ? "0 4px 12px rgba(0, 0, 0, 0.5)" : "none"
    }),

    pedalIcon: css({
        width: 24,
        height: 24,
        opacity: 0.8
    }),
    connector: css({
        position: "absolute",
        width: CELL_WIDTH,
        height: CELL_HEIGHT
    }),
    stroke: css({
        position: "absolute",
        background: "#888"
    }),
    stereoStrokeOuter: css({
        position: "absolute",
        background: "#888"
    }),
    stereoStrokeInner: css({
        position: "absolute",
        background: "#888"
    }),

});

export type OnSelectHandler = (selectedPedal: number) => void;

interface DropPreview {
    action: "before" | "after" | "start" | "end";
    targetInstanceId: number;
    previewX: number;
    previewY: number;
}

interface PedalboardProps extends WithStyles<typeof pedalboardStyles> {
    theme: Theme;
    selectedId?: number;
    onSelectionChanged?: OnSelectHandler;
    onDoubleClick?: OnSelectHandler;
    hasTinyToolBar: boolean;
    enableStructureEditing: boolean;
    hardwareView?: boolean;
    chainZoom?: number;
    panX?: number;
    panY?: number;
    centerViewSeq?: number;
    onPanChange?: (panX: number, panY: number) => void;
    onWheelZoom?: (deltaZoom: number) => void;
    onLayoutSizeChanged?: (width: number, height: number) => void;
}
interface LayoutSize {
    width: number;
    height: number;
}

type PedalboardState = {
    pedalboard?: Pedalboard;
    draggingInstanceId: number | null;
    isOverTrash: boolean;
    dropPreview: DropPreview | null;
    isPanning: boolean;
    panX: number;
    panY: number;
};

const EMPTY_PEDALS: PedalLayout[] = [];


function makeChain(model: PiPedalModel, uiItems?: PedalboardItem[]): PedalLayout[] {
    let result: PedalLayout[] = [];
    if (uiItems) {
        for (let i = 0; i < uiItems.length; ++i) {
            let item = uiItems[i];
            result.push(new PedalLayout(model, item));
        }
    }
    return result;
}

class PedalLayout {
    uri: string = "";
    name: string = "";
    pluginType: PluginType = PluginType.Plugin;
    iconUrl: string = "";
    iconColor: string = "";

    bounds: Rect = new Rect();

    numberOfInputs: number = 2;
    numberOfOutputs: number = 2;
    originalInputs: number = 2;
    originalOutputs: number = 2;

    pedalItem?: PedalboardItem;

    // Split Layout only.
    topChildren: PedalLayout[] = EMPTY_PEDALS;
    bottomChildren: PedalLayout[] = EMPTY_PEDALS;
    topConnectorY: number = 0;
    bottomConnectorY: number = 0;


    static Start(): PedalLayout {
        let t: PedalLayout = new PedalLayout();
        t.uri = START_PEDALBOARD_ITEM_URI;
        t.pluginType = PluginType.Terminal;
        t.iconUrl = TERMINAL_ICON_URL;
        t.numberOfInputs = 0;
        t.numberOfOutputs = 2;
        return t;
    }
    static End(): PedalLayout {
        let t: PedalLayout = new PedalLayout();
        t.pluginType = PluginType.Terminal;
        t.uri = END_PEDALBOARD_ITEM_URI;
        t.iconUrl = TERMINAL_ICON_URL;
        t.numberOfInputs = 2;
        t.numberOfOutputs = 0;
        return t;
    }
    constructor(model?: PiPedalModel, pedalItem?: PedalboardItem) {
        if (model === undefined && pedalItem === undefined) {
            return;
        }
        if (model === undefined || pedalItem === undefined) {
            throw new Error("Invalid arguments.");
        }
        this.pedalItem = pedalItem;
        this.uri = pedalItem.uri;
        if (pedalItem.isSplit()) {
            let splitter = pedalItem as PedalboardSplitItem;

            this.pluginType = PluginType.UtilityPlugin;
            this.topChildren = makeChain(model, splitter.topChain);
            this.bottomChildren = makeChain(model, splitter.bottomChain);

            this.numberOfInputs = 2;
            this.numberOfOutputs = 2;

        } else if (pedalItem.isEmpty()) {

            this.pluginType = PluginType.None;
            this.iconUrl = EMPTY_ICON_URL;
            this.numberOfInputs = 2;
            this.numberOfOutputs = 2;

        } else if (pedalItem.uri === START_PEDALBOARD_ITEM_URI) {
            this.pluginType = PluginType.UtilityPlugin;
            this.iconUrl = TERMINAL_ICON_URL;
            this.numberOfInputs = 0;
            this.numberOfOutputs = PiPedalModelFactory.getInstance().jackSettings.get().inputAudioPorts.length;
            if (this.numberOfOutputs === 0) {
                this.numberOfOutputs = 1;
            }

        } else if (pedalItem.uri === END_PEDALBOARD_ITEM_URI) {
            this.pluginType = PluginType.UtilityPlugin;
            this.iconUrl = TERMINAL_ICON_URL;
            this.numberOfInputs = PiPedalModelFactory.getInstance().jackSettings.get().outputAudioPorts.length;
            if (this.numberOfInputs === 0) {
                this.numberOfInputs = 1;
            }
            this.numberOfOutputs = 0;
        }
        else {
            let uiPlugin = model.getUiPlugin(pedalItem.uri);
            if (uiPlugin != null) {
                let pluginType = uiPlugin.plugin_type;
                this.pluginType = pluginType;
                if (this.uri === "http://two-play.com/plugins/toob-nam") {
                    pluginType = PluginType.NamPlugin;
                }
                this.iconUrl = SelectIconUri(pluginType);
                this.iconColor = pedalItem.iconColor;
                this.name = uiPlugin.label;
                if (pedalItem.title !== "") {
                    this.name = pedalItem.title;
                }
                this.numberOfInputs = Math.min(uiPlugin.audio_inputs, 2);
                this.numberOfOutputs = Math.min(uiPlugin.audio_outputs, 2);
            } else {
                // default to empty plugin.
                this.pluginType = PluginType.ErrorPlugin;
                this.name = pedalItem.pluginName ?? "#error";
                this.iconUrl = ERROR_ICON_URL;
                this.numberOfInputs = 2;
                this.numberOfOutputs = 2;
            }
        }
        this.originalInputs = this.numberOfInputs;
        this.originalOutputs = this.numberOfOutputs;
    }
    isEmpty(): boolean {
        return (!this.pedalItem) || this.pedalItem.isEmpty();
    }
    isSplitter(): boolean {
        return this.pedalItem !== undefined && this.pedalItem.isSplit();
    }
    isStart() {
        return this.uri === START_PEDALBOARD_ITEM_URI;
    }
    isEnd() {
        return this.uri === END_PEDALBOARD_ITEM_URI;
    }
}

function* chainIterator(layoutChain: PedalLayout[]): Generator<PedalLayout, void, undefined> {
    for (let i = 0; i < layoutChain.length; ++i) {
        let item = layoutChain[i];
        yield item;
        if (item.isSplitter()) {
            let g = chainIterator(item.topChildren);
            while (true) {
                let v = g.next();
                if (v.done) {
                    break;
                }
                yield v.value;
            }
            g = chainIterator(item.bottomChildren);
            while (true) {
                let v = g.next();
                if (v.done) {
                    break;
                }
                yield v.value;
            }
        }
    }
    return;
}



class LayoutParams {
    nextId: number = 1;
    cx: number = 0;
    cy: number = 0;
}


const PedalboardView =
    withTheme(
        withStyles(
            class extends Component<PedalboardProps, PedalboardState> {
                model: PiPedalModel;

                frameRef: React.RefObject<HTMLDivElement | null>;
                scrollRef: React.RefObject<HTMLDivElement | null>;
                trashRef: React.RefObject<HTMLDivElement | null>;
                private bgColor: string;
                private panStartClientX: number = 0;
                private panStartClientY: number = 0;
                private panStartOffsetX: number = 0;
                private panStartOffsetY: number = 0;
                private panPointerId: number = -1;

                constructor(props: PedalboardProps) {
                    super(props);
                    this.model = PiPedalModelFactory.getInstance();

                    this.bgColor = props.theme.palette.background.default

                    if (!props.selectedId) props.selectedId = -1;
                    this.state = {
                        pedalboard: this.model.pedalboard.get(),
                        draggingInstanceId: null,
                        isOverTrash: false,
                        dropPreview: null,
                        isPanning: false,
                        panX: props.panX ?? 0,
                        panY: props.panY ?? 0,
                    };
                    this.onPedalboardChanged = this.onPedalboardChanged.bind(this);
                    this.frameRef = React.createRef();
                    this.scrollRef = React.createRef();
                    this.trashRef = React.createRef();
                    this.handleTouchStart = this.handleTouchStart.bind(this);
                    this.onStagePointerDown = this.onStagePointerDown.bind(this);
                    this.onStagePointerMove = this.onStagePointerMove.bind(this);
                    this.onStagePointerUp = this.onStagePointerUp.bind(this);
                    this.onStageWheel = this.onStageWheel.bind(this);
                }

                onStagePointerDown(e: React.PointerEvent<HTMLDivElement>) {
                    // Only pan when clicking the empty background or connector area (not a pedal button)
                    let target = e.target as HTMLElement | null;
                    while (target && target !== e.currentTarget) {
                        if (target.tagName === "BUTTON" || target.classList.contains("MuiButtonBase-root")) {
                            return;
                        }
                        target = target.parentElement;
                    }
                    if (e.pointerType === "mouse" && e.button !== 0 && e.button !== 1) {
                        return;
                    }
                    this.panPointerId = e.pointerId;
                    this.panStartClientX = e.clientX;
                    this.panStartClientY = e.clientY;
                    this.panStartOffsetX = this.state.panX;
                    this.panStartOffsetY = this.state.panY;
                    try {
                        e.currentTarget.setPointerCapture(e.pointerId);
                    } catch (_err) { }
                    this.setState({ isPanning: true });
                }

                onStagePointerMove(e: React.PointerEvent<HTMLDivElement>) {
                    if (!this.state.isPanning || e.pointerId !== this.panPointerId) return;
                    let dx = e.clientX - this.panStartClientX;
                    let dy = e.clientY - this.panStartClientY;
                    this.setState({
                        panX: this.panStartOffsetX + dx,
                        panY: this.panStartOffsetY + dy
                    });
                }

                onStagePointerUp(e: React.PointerEvent<HTMLDivElement>) {
                    if (this.state.isPanning && e.pointerId === this.panPointerId) {
                        try {
                            e.currentTarget.releasePointerCapture(e.pointerId);
                        } catch (_err) { }
                        this.panPointerId = -1;
                        let finalX = this.state.panX;
                        let finalY = this.state.panY;
                        this.setState({ isPanning: false });
                        if (this.props.onPanChange) {
                            this.props.onPanChange(finalX, finalY);
                        }
                    }
                }

                componentDidUpdate(prevProps: PedalboardProps) {
                    if ((prevProps.panX !== this.props.panX || prevProps.panY !== this.props.panY || prevProps.centerViewSeq !== this.props.centerViewSeq) && !this.state.isPanning) {
                        this.setState({
                            panX: this.props.panX ?? 0,
                            panY: this.props.panY ?? 0
                        });
                    }
                }

                onStageWheel(e: React.WheelEvent<HTMLDivElement>) {
                    if (this.props.onWheelZoom) {
                        e.preventDefault();
                        let delta = e.deltaY < 0 ? 0.05 : -0.05;
                        this.props.onWheelZoom(delta);
                    }
                }

                handleTouchStart(e: any) {
                    // just has to exist to allow Draggable to receive 
                    // touchyMove. :-/
                }

                isSplitterChild(item: PedalboardItem, splitterInstanceId: number) {
                    if (item.instanceId === splitterInstanceId) {
                        return true;
                    }
                    let pedalboard: Pedalboard | undefined = this.state.pedalboard;
                    if (!pedalboard) return false;

                    let splitter = pedalboard.maybeGetItem(splitterInstanceId);
                    if (splitter === null) {
                        return false;
                    }
                    return splitter.isChild(item.instanceId);
                }

                isPointInTrashZone(clientX: number, clientY: number): boolean {
                    let trashEl = this.trashRef.current;
                    if (!trashEl) return false;
                    let rc = trashEl.getBoundingClientRect();
                    let pad = 28;
                    return (
                        clientX >= rc.left - pad &&
                        clientX <= rc.right + pad &&
                        clientY >= rc.top - pad &&
                        clientY <= rc.bottom + pad
                    );
                }

                private filterNoOpDropPreview(instanceId: number, preview: DropPreview | null, currentLayout: PedalLayout[]): DropPreview | null {
                    if (!preview) return null;
                    let draggedLayout: PedalLayout | null = null;
                    let it = chainIterator(currentLayout);
                    while (true) {
                        let v = it.next();
                        if (v.done) break;
                        if (v.value.pedalItem?.instanceId === instanceId) {
                            draggedLayout = v.value;
                            break;
                        }
                    }
                    if (!draggedLayout) return preview;

                    // If the preview insertion point is on the same row and touches either the left edge
                    // or the right edge of the dragged item's own cell, moving there is a no-op!
                    let sameRow = Math.abs(preview.previewY - draggedLayout.bounds.y) < CELL_HEIGHT * 0.4;
                    if (sameRow) {
                        let touchesLeftEdge = Math.abs(preview.previewX - draggedLayout.bounds.x) < 4;
                        let touchesRightEdge = Math.abs(preview.previewX - draggedLayout.bounds.right) < 4;
                        if (touchesLeftEdge || touchesRightEdge) {
                            return null;
                        }
                    }
                    return preview;
                }

                resolveDropTarget(instanceId: number, clientX: number, clientY: number): DropPreview | null {
                    let rawPreview = this.resolveDropTargetRaw(instanceId, clientX, clientY);
                    if (!rawPreview || !this.currentLayout) return null;
                    return this.filterNoOpDropPreview(instanceId, rawPreview, this.currentLayout);
                }

                resolveDropTargetRaw(instanceId: number, clientX: number, clientY: number): DropPreview | null {
                    if (!this.currentLayout || !this.frameRef.current) return null;

                    let currentLayout: PedalLayout[] = this.currentLayout;
                    let frameElement = this.frameRef.current;
                    let rc = frameElement.getBoundingClientRect();
                    let zoom = this.props.chainZoom ?? 1.0;
                    let localX = (clientX - rc.left) / zoom;
                    let localY = (clientY - rc.top) / zoom;

                    let it = chainIterator(currentLayout);

                    while (true) {
                        let v = it.next();
                        if (v.done) break;
                        let item = v.value;

                        if (item.isSplitter() && item.pedalItem) {
                            if (item.bounds.contains(localX, localY)) {
                                if (localX < item.bounds.x + CELL_WIDTH / 2) {
                                    if (this.isSplitterChild(item.pedalItem, instanceId)) {
                                        return null;
                                    }
                                    return {
                                        action: "before",
                                        targetInstanceId: item.pedalItem.instanceId,
                                        previewX: item.bounds.x,
                                        previewY: item.bounds.y
                                    };
                                } else if (localX > item.bounds.right - CELL_WIDTH / 2) {
                                    if (this.isSplitterChild(item.pedalItem, instanceId)) {
                                        return null;
                                    }
                                    return {
                                        action: "after",
                                        targetInstanceId: item.pedalItem.instanceId,
                                        previewX: item.bounds.right,
                                        previewY: item.bounds.y
                                    };
                                }
                            }
                            let yMid = (item.bounds.y + item.bounds.bottom) / 2;
                            if (localX >= item.bounds.x
                                && localY < yMid && localY >= item.topChildren[0].bounds.y
                            ) {
                                if (localX < item.topChildren[0].bounds.x) {
                                    let topPedalItem = item.topChildren[0].pedalItem;
                                    if (topPedalItem) {
                                        if (this.isSplitterChild(topPedalItem, instanceId)) {
                                            return null;
                                        }
                                        return {
                                            action: "before",
                                            targetInstanceId: topPedalItem.instanceId,
                                            previewX: item.topChildren[0].bounds.x,
                                            previewY: item.topChildren[0].bounds.y
                                        };
                                    }
                                }
                                let lastTop = item.topChildren[item.topChildren.length - 1];
                                if (localX >= lastTop.bounds.right && localX < item.bounds.right - CELL_WIDTH / 2) {
                                    if (lastTop.pedalItem) {
                                        if (this.isSplitterChild(lastTop.pedalItem, instanceId)) {
                                            return null;
                                        }
                                        return {
                                            action: "after",
                                            targetInstanceId: lastTop.pedalItem.instanceId,
                                            previewX: lastTop.bounds.right,
                                            previewY: lastTop.bounds.y
                                        };
                                    }
                                }
                            }
                            if (localX >= item.bounds.x
                                && localY > yMid && localY < item.bottomChildren[0].bounds.bottom
                            ) {
                                if (localX < item.bottomChildren[0].bounds.x) {
                                    let bottomPedalItem = item.bottomChildren[0].pedalItem;
                                    if (bottomPedalItem) {
                                        if (this.isSplitterChild(bottomPedalItem, instanceId)) {
                                            return null;
                                        }
                                        return {
                                            action: "before",
                                            targetInstanceId: bottomPedalItem.instanceId,
                                            previewX: item.bottomChildren[0].bounds.x,
                                            previewY: item.bottomChildren[0].bounds.y
                                        };
                                    }
                                }
                                let lastBottom = item.bottomChildren[item.bottomChildren.length - 1];
                                if (localX >= lastBottom.bounds.right && localX < item.bounds.right - CELL_WIDTH / 2) {
                                    if (lastBottom.pedalItem) {
                                        if (this.isSplitterChild(lastBottom.pedalItem, instanceId)) {
                                            return null;
                                        }
                                        return {
                                            action: "after",
                                            targetInstanceId: lastBottom.pedalItem.instanceId,
                                            previewX: lastBottom.bounds.right,
                                            previewY: lastBottom.bounds.y
                                        };
                                    }
                                }
                            }
                        } else if (item.bounds.contains(localX, localY)) {
                            if (item.isStart()) {
                                return {
                                    action: "start",
                                    targetInstanceId: START_CONTROL,
                                    previewX: item.bounds.right,
                                    previewY: item.bounds.y
                                };
                            } else if (item.isEnd()) {
                                return {
                                    action: "end",
                                    targetInstanceId: END_CONTROL,
                                    previewX: item.bounds.x,
                                    previewY: item.bounds.y
                                };
                            } else {
                                if (item.pedalItem) {
                                    if (item.pedalItem.instanceId === instanceId) {
                                        return null;
                                    }
                                    if (this.isSplitterChild(item.pedalItem, instanceId)) {
                                        return null;
                                    }
                                    // Always insert BEFORE (left half) or AFTER (right half) — never overwrite/replace!
                                    if (localX < item.bounds.x + CELL_WIDTH / 2) {
                                        return {
                                            action: "before",
                                            targetInstanceId: item.pedalItem.instanceId,
                                            previewX: item.bounds.x,
                                            previewY: item.bounds.y
                                        };
                                    } else {
                                        return {
                                            action: "after",
                                            targetInstanceId: item.pedalItem.instanceId,
                                            previewX: item.bounds.right,
                                            previewY: item.bounds.y
                                        };
                                    }
                                }
                            }
                        }
                    }
                    return null;
                }

                onDragStart(instanceId: number, _clientX: number, _clientY: number) {
                    if (!this.props.enableStructureEditing) return;
                    this.setState({
                        draggingInstanceId: instanceId,
                        isOverTrash: false,
                        dropPreview: null,
                    });
                }

                onDragMove(instanceId: number, clientX: number, clientY: number) {
                    if (!this.props.enableStructureEditing) return;
                    let overTrash = this.isPointInTrashZone(clientX, clientY);
                    let preview = overTrash ? null : this.resolveDropTarget(instanceId, clientX, clientY);
                    let prev = this.state.dropPreview;
                    let samePreview =
                        (prev === null && preview === null) ||
                        (prev !== null && preview !== null &&
                            prev.action === preview.action &&
                            prev.targetInstanceId === preview.targetInstanceId &&
                            prev.previewX === preview.previewX &&
                            prev.previewY === preview.previewY);

                    if (overTrash !== this.state.isOverTrash || !samePreview) {
                        this.setState({
                            isOverTrash: overTrash,
                            dropPreview: preview,
                        });
                    }
                }

                onDragCancel() {
                    if (this.state.draggingInstanceId !== null) {
                        this.setState({
                            draggingInstanceId: null,
                            isOverTrash: false,
                            dropPreview: null,
                        });
                    }
                }

                onDragEnd(instanceId: number, clientX: number, clientY: number) {
                    let overTrash = this.isPointInTrashZone(clientX, clientY);
                    this.setState({
                        draggingInstanceId: null,
                        isOverTrash: false,
                        dropPreview: null,
                    });

                    if (!this.props.enableStructureEditing) {
                        return;
                    }

                    // Only delete the plugin if explicitly dropped onto the Trash zone!
                    if (overTrash) {
                        let newId = this.model.setPedalboardItemEmpty(instanceId);
                        this.setSelection(newId);
                        return;
                    }

                    let dropTarget = this.resolveDropTarget(instanceId, clientX, clientY);
                    if (!dropTarget) {
                        // Dropped outside the chain and not on the trash icon -> snap back to original place!
                        return;
                    }

                    switch (dropTarget.action) {
                        case "start":
                            this.model.movePedalboardItemToStart(instanceId);
                            this.setSelection(instanceId);
                            break;
                        case "end":
                            this.model.movePedalboardItemToEnd(instanceId);
                            this.setSelection(instanceId);
                            break;
                        case "before":
                            this.model.movePedalboardItemBefore(instanceId, dropTarget.targetInstanceId);
                            this.setSelection(instanceId);
                            break;
                        case "after":
                            this.model.movePedalboardItemAfter(instanceId, dropTarget.targetInstanceId);
                            this.setSelection(instanceId);
                            break;
                    }
                }

                onPedalboardChanged(value?: Pedalboard) {
                    this.setState({
                        pedalboard: value,
                    });
                }

                componentDidMount() {
                    this.scrollRef.current!.addEventListener("touchstart", this.handleTouchStart, { passive: false });
                    this.model.pedalboard.addOnChangedHandler(this.onPedalboardChanged);

                }
                componentWillUnmount() {
                    this.scrollRef.current!.removeEventListener("touchstart", this.handleTouchStart);
                    this.model.pedalboard.removeOnChangedHandler(this.onPedalboardChanged);
                }

                offsetLayout_(layoutItems: PedalLayout[], offset: number): void {
                    for (let i = 0; i < layoutItems.length; ++i) {
                        let layoutItem = layoutItems[i];
                        layoutItem.bounds.y += offset;
                        if (layoutItem.isSplitter()) {
                            layoutItem.topConnectorY += offset;
                            layoutItem.bottomConnectorY += offset;
                            this.offsetLayout_(layoutItem.topChildren, offset);
                            this.offsetLayout_(layoutItem.bottomChildren, offset);
                        }
                    }
                }

                getSplitterIcon(layoutItem: PedalLayout): PluginType {
                    if (layoutItem.pedalItem === undefined) {
                        throw new Error("Invalid splitter");
                    }
                    let split = layoutItem.pedalItem as PedalboardSplitItem;
                    if (split.getSplitType() === SplitType.Ab) {
                        if (split.isASelected()) {
                            return PluginType.SplitA;
                        } else {
                            return PluginType.SplitB;

                        }
                    } else if (split.getSplitType() === SplitType.Mix) {
                        return PluginType.SplitMix; //"img/fx_dial.svg";
                    } else {
                        return PluginType.SplitLR; //"img/fx_lr.svg";
                    }
                }

                doLayout2_(lp: LayoutParams, layoutItems: PedalLayout[]): Rect {
                    let bounds = new Rect();
                    for (let i = 0; i < layoutItems.length; ++i) {
                        let layoutItem = layoutItems[i];
                        if (layoutItem.isSplitter()) {
                            let x0 = lp.cx;
                            let y0 = lp.cy;

                            layoutItem.bounds.x = x0;
                            layoutItem.bounds.y = y0;
                            layoutItem.bounds.height = CELL_HEIGHT;
                            layoutItem.bounds.width = CELL_WIDTH;

                            lp.cx += CELL_WIDTH;


                            let topBounds = this.doLayout2_(lp, layoutItem.topChildren);
                            if (topBounds.isEmpty()) {
                                topBounds.x = lp.cx;
                                topBounds.width = 0;
                                topBounds.y = y0 - CELL_HEIGHT / 2;
                                topBounds.height = CELL_HEIGHT;

                            }


                            let dyTop = (lp.cy + CELL_HEIGHT / 2) - (topBounds.y + topBounds.height);



                            this.offsetLayout_(layoutItem.topChildren, dyTop);
                            topBounds.offset(0, dyTop);
                            bounds.accumulate(topBounds);

                            let topCx = lp.cx;
                            lp.cx = x0;
                            lp.cx += CELL_WIDTH;

                            let bottomBounds = this.doLayout2_(lp, layoutItem.bottomChildren);
                            if (bottomBounds.isEmpty()) {
                                bottomBounds.x = lp.cx; bottomBounds.width = 0;
                                bottomBounds.y = lp.cy; bottomBounds.height = CELL_HEIGHT;
                            }

                            let dyBottom = (lp.cy + CELL_HEIGHT / 2) - bottomBounds.y;
                            this.offsetLayout_(layoutItem.bottomChildren, dyBottom)
                            bottomBounds.offset(0, dyBottom);
                            bounds.accumulate(bottomBounds);

                            lp.cx = Math.max(lp.cx, topCx) + CELL_WIDTH;
                            lp.cy = y0;

                            layoutItem.bounds.width = lp.cx - layoutItem.bounds.x;
                            bounds.accumulate(layoutItem.bounds);

                            if (layoutItem.topChildren.length === 0) {
                                layoutItem.topConnectorY = bounds.y + CELL_HEIGHT / 2;
                            } else {
                                layoutItem.topConnectorY = layoutItem.topChildren[0].bounds.y + CELL_HEIGHT / 2;
                            }
                            if (layoutItem.bottomChildren.length === 0) {
                                layoutItem.bottomConnectorY = bounds.y + bounds.height - CELL_HEIGHT / 2;
                            } else {
                                layoutItem.bottomConnectorY = layoutItem.bottomChildren[0].bounds.y + CELL_HEIGHT / 2;
                            }
                        } else {
                            layoutItem.bounds.x = lp.cx;
                            layoutItem.bounds.y = lp.cy;
                            lp.cx += CELL_WIDTH;
                            layoutItem.bounds.width = CELL_WIDTH;
                            layoutItem.bounds.height = CELL_HEIGHT;
                            bounds.accumulate(layoutItem.bounds);

                        }
                    }
                    return bounds;
                }
                doLayout(layoutItems: PedalLayout[]): LayoutSize {
                    if (layoutItems.length === 0) {
                        // if the current pedalboard is empty, reserve display space anyway.
                        return { width: 1, height: CELL_HEIGHT };
                    }

                    let lp = new LayoutParams();

                    let bounds = this.doLayout2_(lp, layoutItems);
                    // shift everything down so there are no negative y coordinates.
                    this.offsetLayout_(layoutItems, -bounds.y);
                    return { width: bounds.width, height: bounds.height };

                }

                onItemClick(e: SyntheticEvent, instanceId?: number): void {
                    if (instanceId) {
                        this.setSelection(instanceId);
                    }
                }
                setSelection(instanceId: number) {
                    if (this.props.onSelectionChanged) {
                        this.props.onSelectionChanged(instanceId);
                    }
                }

                onItemDoubleClick(event: SyntheticEvent, instanceId?: number): void {
                    event.preventDefault();
                    event.stopPropagation();

                    if (this.props.onDoubleClick && instanceId && this.props.enableStructureEditing) {
                        this.props.onDoubleClick(instanceId);
                    }

                }

                onItemLongClick(event: SyntheticEvent, instanceId?: number): void {
                    if (!instanceId) {
                        return;
                    }
                    event.preventDefault();
                    event.stopPropagation();

                    if (!this.props.enableStructureEditing) {
                        this.setSelection(instanceId);
                        return;
                    }
                    if (!Utility.needsZoomedControls()) {
                        if (this.props.onDoubleClick && this.props.enableStructureEditing && instanceId) {
                            this.props.onDoubleClick(instanceId);
                        }
                    }

                }

                strokeConnector(output: ReactNode[], channels: number, enabled: Boolean, svgPath: string) {
                    let color = enabled ? ENABLED_CONNECTOR_COLOR : DISABLED_CONNECTOR_COLOR;

                    if (channels === 2) {
                        output.push((
                            <path key={this.renderKey++} d={svgPath} stroke={color} strokeWidth={SVG_STEREO_STROKE_WIDTH} />
                        ));
                        output.push((
                            <path key={this.renderKey++} d={svgPath} stroke={this.bgColor} strokeWidth={SVG_STROKE_WIDTH} />
                        ));
                    } else if (channels === 1) {
                        output.push((
                            <path key={this.renderKey++} d={svgPath} stroke={color} strokeWidth={SVG_STROKE_WIDTH} />
                        ));
                    }
                }

                renderConnector(output: ReactNode[], item: PedalLayout, enabled: boolean): void {
                    // const classes = withStyles.getClasses(this.props);
                    let x_ = item.bounds.x + CELL_WIDTH / 2;
                    let y_ = item.bounds.y + CELL_HEIGHT / 2;
                    let numberOfOutputs = item.numberOfOutputs;
                    let color = enabled ? ENABLED_CONNECTOR_COLOR : DISABLED_CONNECTOR_COLOR;
                    let stereoCenterColor = this.bgColor;

                    if (item.originalInputs === 0) {
                        // break the input paths.
                        let rx = item.bounds.x + CELL_WIDTH / 2 - FRAME_SIZE / 2 - 4;
                        let ry = y_ - 4;

                        output.push((
                            <rect key={this.renderKey++} x={rx} y={ry} width={4} height={8} fill={this.props.theme.palette.background.paper} />
                        ));
                    }
                    let svgPath = new SvgPathBuilder().moveTo(x_, y_).lineTo(x_ + CELL_WIDTH, y_).toString();


                    if (numberOfOutputs === 2) {
                        output.push((
                            <path key={this.renderKey++} d={svgPath} stroke={color} strokeWidth={SVG_STEREO_STROKE_WIDTH} />
                        ));
                        output.push((
                            <path key={this.renderKey++} d={svgPath} stroke={stereoCenterColor} strokeWidth={SVG_STROKE_WIDTH} />
                        ));
                    } else if (numberOfOutputs === 1) {
                        output.push((
                            <path key={this.renderKey++} d={svgPath} stroke={color} strokeWidth={SVG_STROKE_WIDTH} />
                        ));
                    } else {
                        output.push((
                            <path key={this.renderKey++} d={svgPath} stroke={DISABLED_CONNECTOR_COLOR} strokeWidth={SVG_STROKE_WIDTH} />
                        ));

                    }
                }
                renderSplitConnectors(output: ReactNode[], item: PedalLayout, enabled: boolean, shortSplitOutput: boolean,): void {
                    //const classes = withStyles.getClasses(this.props);
                    let x_ = item.bounds.x + CELL_WIDTH / 2;
                    let y_ = item.bounds.y + CELL_HEIGHT / 2;
                    let yTop = item.topConnectorY;
                    let yBottom = item.bottomConnectorY;
                    //let isStereo = item.stereoOutput;
                    let split = item.pedalItem as PedalboardSplitItem;

                    let topEnabled = enabled && split.isASelected();
                    let bottomEnabled = enabled && split.isBSelected();
                    let topColor = topEnabled ? ENABLED_CONNECTOR_COLOR : DISABLED_CONNECTOR_COLOR;
                    let bottomColor = bottomEnabled ? ENABLED_CONNECTOR_COLOR : DISABLED_CONNECTOR_COLOR;


                    let topStartPath = new SvgPathBuilder().moveTo(x_, y_).lineTo(x_, yTop).lineTo(x_ + CELL_WIDTH, yTop).toString();
                    let bottomStartPath = new SvgPathBuilder().moveTo(x_, y_).lineTo(x_, yBottom).lineTo(x_ + CELL_WIDTH, yBottom).toString();

                    if (item.numberOfInputs === 2 && item.topChildren[0].numberOfInputs === 2) {
                        output.push((<path key={this.renderKey++} d={topStartPath} stroke={topColor} strokeWidth={SVG_STEREO_STROKE_WIDTH} />));
                        output.push((<path key={this.renderKey++} d={topStartPath} stroke={this.bgColor} strokeWidth={SVG_STROKE_WIDTH} />));
                    } else if (item.numberOfInputs !== 0 && item.topChildren[0].numberOfInputs !== 0) {
                        output.push((<path key={this.renderKey++} d={topStartPath} stroke={topColor} strokeWidth={SVG_STROKE_WIDTH} />));
                    }

                    if (item.numberOfInputs === 2 && item.bottomChildren[0].numberOfInputs === 2) {
                        output.push((<path key={this.renderKey++} d={bottomStartPath} stroke={bottomColor} strokeWidth={SVG_STEREO_STROKE_WIDTH} />));
                        output.push((<path key={this.renderKey++} d={bottomStartPath} stroke={this.bgColor} strokeWidth={SVG_STROKE_WIDTH} />));

                    } else if (item.numberOfInputs !== 0 && item.bottomChildren[0].numberOfInputs !== 0) {
                        output.push((<path key={this.renderKey++} d={bottomStartPath} stroke={bottomColor} strokeWidth={SVG_STROKE_WIDTH} />));
                    }

                    let lastTop = item.topChildren[item.topChildren.length - 1];
                    let lastBottom = item.bottomChildren[item.bottomChildren.length - 1];

                    let xTop = lastTop.bounds.right - CELL_WIDTH / 2;
                    let xBottom = lastBottom.bounds.right - CELL_WIDTH / 2;

                    let xEnd = shortSplitOutput ? item.bounds.right : item.bounds.right + CELL_WIDTH / 2;
                    let xTee0 = item.bounds.right - CELL_WIDTH / 2;

                    let firstPath: string;  // top or bottom depending on draw order.
                    let secondPath: string;  // top or bottom depending on draw order.

                    let firstPathStereo: boolean;
                    let secondPathStereo: boolean;
                    let firstPathAbsent: boolean;
                    let secondPathAbsent: boolean;
                    let firstPathEnabled: boolean;
                    let secondPathEnabled: boolean;
                    let xTee: number;

                    let monoAdjustment = (STEREO_STROKE_WIDTH - STROKE_WIDTH) / 2;

                    let bottomPathFirst = topEnabled && !bottomEnabled;
                    let topPathFirst = bottomEnabled && !topEnabled;


                    // Third case: L/R stereo output, when both outputs are mono, requires a third stroke.
                    let thirdPath: string | null = null; // for L/R stereo output (which can be stereo even if both outputs are mono)
                    let hasThirdPath = item.numberOfOutputs === 2 && (lastTop.numberOfOutputs !== 2) && (lastBottom.numberOfOutputs !== 2);

                    if (hasThirdPath) {
                        firstPathStereo = false;
                        secondPathStereo = false;
                        firstPathAbsent = lastTop.numberOfOutputs === 0 || item.numberOfOutputs === 0;
                        secondPathAbsent = lastBottom.numberOfOutputs === 0 || item.numberOfOutputs === 0;
                        xTee = xTee0 - monoAdjustment;
                        firstPath = new SvgPathBuilder().moveTo(xBottom, yBottom).lineTo(xTee, yBottom).lineTo(xTee, y_).toString();

                        secondPath = new SvgPathBuilder().moveTo(xTop, yTop).lineTo(xTee, yTop).lineTo(xTee, y_).toString();

                        hasThirdPath = true;
                        thirdPath = new SvgPathBuilder().moveTo(xTee0, y_).lineTo(xEnd, y_).toString();
                        firstPathEnabled = bottomEnabled;
                        secondPathEnabled = topEnabled;
                    } else if (bottomPathFirst || (topEnabled && lastTop.numberOfOutputs === 2)) {
                        // draw the bottom path first.
                        firstPathStereo = item.numberOfOutputs === 2 && lastBottom.numberOfOutputs === 2;
                        secondPathStereo = item.numberOfOutputs === 2 && lastTop.numberOfOutputs === 2;
                        firstPathAbsent = item.numberOfOutputs === 0 || lastBottom.numberOfOutputs === 0;
                        secondPathAbsent = item.numberOfOutputs === 0 || lastTop.numberOfOutputs === 0;

                        xTee = firstPathStereo ? xTee0 : xTee0 - monoAdjustment;
                        firstPath = new SvgPathBuilder().moveTo(xBottom, yBottom).lineTo(xTee, yBottom).lineTo(xTee, y_).toString();
                        xTee = secondPathStereo ? xTee0 : xTee0 - monoAdjustment;

                        secondPath = new SvgPathBuilder().moveTo(xTop, yTop).lineTo(xTee, yTop).lineTo(xTee, y_).lineTo(xEnd, y_).toString();
                        firstPathEnabled = bottomEnabled;
                        secondPathEnabled = topEnabled;
                    } else {
                        // draw the top path first.
                        firstPathStereo = item.numberOfOutputs === 2 && lastTop.numberOfOutputs === 2;
                        secondPathStereo = item.numberOfOutputs === 2 && lastBottom.numberOfOutputs === 2;
                        firstPathAbsent = item.numberOfOutputs === 0 || lastTop.numberOfOutputs === 0;
                        secondPathAbsent = item.numberOfOutputs === 0 || lastBottom.numberOfOutputs === 0;

                        xTee = firstPathStereo ? xTee0 : xTee0 - monoAdjustment;
                        firstPath = new SvgPathBuilder().moveTo(xTop, yTop).lineTo(xTee, yTop).lineTo(xTee, y_).toString();

                        xTee = secondPathStereo ? xTee0 : xTee0 - monoAdjustment;
                        secondPath = new SvgPathBuilder().moveTo(xBottom, yBottom).lineTo(xTee, yBottom).lineTo(xTee, y_).lineTo(xEnd, y_).toString();

                        firstPathEnabled = topEnabled;
                        secondPathEnabled = bottomEnabled;
                    }
                    let firstPathColor = firstPathEnabled ? ENABLED_CONNECTOR_COLOR : DISABLED_CONNECTOR_COLOR;
                    let secondPathColor = secondPathEnabled ? ENABLED_CONNECTOR_COLOR : DISABLED_CONNECTOR_COLOR;

                    if (bottomPathFirst || topPathFirst) {
                        // display stereo strokes with cutoff line.
                        if (firstPathStereo) {
                            output.push((
                                <path key={this.renderKey++} d={firstPath} stroke={firstPathColor} strokeWidth={SVG_STEREO_STROKE_WIDTH} />
                            ));
                            output.push((
                                <path key={this.renderKey++} d={firstPath} stroke={this.bgColor} strokeWidth={SVG_STROKE_WIDTH} />
                            ));
                        } else if (!firstPathAbsent) {
                            output.push((
                                <path key={this.renderKey++} d={firstPath} stroke={firstPathColor} strokeWidth={SVG_STROKE_WIDTH} />
                            ));
                        }
                        if (secondPathStereo) {
                            output.push((
                                <path key={this.renderKey++} d={secondPath} stroke={secondPathColor} strokeWidth={SVG_STEREO_STROKE_WIDTH} />
                            ));
                            output.push((
                                <path key={this.renderKey++} d={secondPath} stroke={this.bgColor} strokeWidth={SVG_STROKE_WIDTH} />
                            ));
                        } else if (!secondPathAbsent) {
                            output.push((
                                <path key={this.renderKey++} d={secondPath} stroke={secondPathColor} strokeWidth={SVG_STROKE_WIDTH} />
                            ));
                        }

                    } else {
                        // stereo strokes merge.
                        if (firstPathStereo) {
                            output.push((
                                <path key={this.renderKey++} d={firstPath} stroke={firstPathColor} strokeWidth={SVG_STEREO_STROKE_WIDTH} />
                            ));
                        } else if (!firstPathAbsent) {
                            output.push((
                                <path key={this.renderKey++} d={firstPath} stroke={firstPathColor} strokeWidth={SVG_STROKE_WIDTH} />
                            ));
                        }
                        if (secondPathStereo) {
                            output.push((
                                <path key={this.renderKey++} d={secondPath} stroke={secondPathColor} strokeWidth={SVG_STEREO_STROKE_WIDTH} />
                            ));
                        } else if (!secondPathAbsent) {
                            output.push((
                                <path key={this.renderKey++} d={secondPath} stroke={secondPathColor} strokeWidth={SVG_STROKE_WIDTH} />
                            ));
                        }

                        // draw stereo inner lines.
                        if (firstPathStereo) {
                            output.push((
                                <path key={this.renderKey++} d={firstPath} stroke={this.bgColor} strokeWidth={SVG_STROKE_WIDTH} />
                            ));
                        }
                        if (secondPathStereo) {
                            output.push((
                                <path key={this.renderKey++} d={secondPath} stroke={this.bgColor} strokeWidth={SVG_STROKE_WIDTH} />
                            ));

                        }
                    }
                    if (thirdPath != null) {
                        // stereo output of L/R splitter
                        output.push((
                            <path key={this.renderKey++} d={thirdPath} stroke={secondPathColor} strokeWidth={SVG_STEREO_STROKE_WIDTH} />
                        ));
                        output.push((
                            <path key={this.renderKey++} d={thirdPath} stroke={this.bgColor} strokeWidth={SVG_STROKE_WIDTH} />
                        ));


                    }
                }
                getScrollContainer() {
                    let el: HTMLElement | undefined | null = this.scrollRef.current;
                    // actually not here anymore. :-/ It has a reactive definition in MainPage.tsx now.
                    while (el) {
                        if (el.id === "pedalboardScroll") {
                            return el as HTMLDivElement;
                        }
                        el = el.parentElement;
                    }
                    throw new PiPedalStateError("scroll container not found.");
                }

                pedalButton(
                    instanceId: number,
                    iconType: PluginType,
                    iconColor: string,
                    draggable: boolean,
                    enabled: boolean,
                    hasBorder: boolean = true,
                    pluginNotFound: boolean,
                    hasMidiConnector: boolean,
                    pedalName: string = "",
                    pluginUri: string = ""
                )
                    : ReactNode {
                    const classes = withStyles.getClasses(this.props);
                    let isSelected = instanceId === this.props.selectedId;
                    let frameStyle = classes.iconFrame;
                    if (!hasBorder) {
                        frameStyle = classes.borderlessIconFrame;
                    } else if (isSelected) {
                        frameStyle = classes.selectedIconFrame;
                    }

                    let catInfo = getPluginCategoryInfo(iconType, iconColor, pluginUri);
                    let isTerminal = !hasBorder;
                    let isEmptySlot = iconType === PluginType.None;
                    let isSplitNode =
                        iconType === PluginType.SplitA ||
                        iconType === PluginType.SplitB ||
                        iconType === PluginType.SplitMix ||
                        iconType === PluginType.SplitLR;

                    let cardBorderColor = isSelected
                        ? catInfo.color
                        : enabled
                            ? (isDarkMode() ? "rgba(255, 255, 255, 0.16)" : "rgba(15, 23, 42, 0.18)")
                            : (isDarkMode() ? "rgba(255, 255, 255, 0.06)" : "rgba(15, 23, 42, 0.08)");

                    let cardBoxShadow = isSelected
                        ? `0 0 18px 1px ${catInfo.glow}, 0 8px 20px rgba(0, 0, 0, 0.65)`
                        : enabled
                            ? (isDarkMode() ? "0 6px 16px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.07)" : "0 4px 12px rgba(15, 23, 42, 0.08)")
                            : "none";

                    return (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ButtonBase className={classes.pedalButton}
                                disableRipple={true}
                                style={isTerminal ? { width: 56, height: 56, borderRadius: 28, margin: "auto", overflow: "visible" } : { overflow: "visible" }}
                                onClick={(e) => { this.onItemClick(e, instanceId); }}
                                onDoubleClick={(e: SyntheticEvent) => { this.onItemDoubleClick(e, instanceId); }}
                                onContextMenu={(e: SyntheticEvent) => { this.onItemLongClick(e, instanceId); }}
                            >
                                {/* Clean placeholder slot shown in the original spot while this item is being dragged */}
                                {this.state.draggingInstanceId === instanceId && !isTerminal && (
                                    <div style={{
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                        width: CARD_WIDTH,
                                        height: CARD_HEIGHT,
                                        borderRadius: 12,
                                        border: isDarkMode()
                                            ? `1.5px dashed ${catInfo.color}66`
                                            : `1.5px dashed ${catInfo.color}88`,
                                        background: isDarkMode()
                                            ? "rgba(19, 24, 36, 0.55)"
                                            : "rgba(226, 232, 240, 0.65)",
                                        backdropFilter: "blur(6px)",
                                        WebkitBackdropFilter: "blur(6px)",
                                        boxSizing: "border-box",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        pointerEvents: "none"
                                    }}>
                                        <div style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: "50%",
                                            border: `1.5px dashed ${catInfo.color}88`
                                        }} />
                                    </div>
                                )}
                                <Draggable draggable={draggable && (this.props.enableStructureEditing)} getScrollContainer={() => this.getScrollContainer()}
                                    onDragStart={(x, y) => { this.onDragStart(instanceId, x, y); }}
                                    onDragMove={(x, y) => { this.onDragMove(instanceId, x, y); }}
                                    onDragCancel={() => { this.onDragCancel(); }}
                                    onDragEnd={(x, y) => { this.onDragEnd(instanceId, x, y) }}
                                    style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}
                                >
                                    <div className={frameStyle}
                                        style={{
                                            position: "absolute",
                                            left: 0,
                                            top: 0,
                                            borderColor: isTerminal ? (isSelected ? "#00E5FF" : undefined) : cardBorderColor,
                                            boxShadow: isTerminal ? (isSelected ? "0 0 14px rgba(0, 229, 255, 0.55)" : undefined) : cardBoxShadow,
                                            borderStyle: isEmptySlot ? "dashed" : "solid",
                                            background: (!isTerminal && !enabled && !isEmptySlot)
                                                ? (isDarkMode()
                                                    ? "linear-gradient(180deg, rgba(24, 30, 44, 0.72) 0%, rgba(15, 19, 29, 0.76) 100%)"
                                                    : "linear-gradient(180deg, rgba(241, 245, 249, 0.74) 0%, rgba(226, 232, 240, 0.78) 100%)")
                                                : undefined,
                                            backdropFilter: (!isTerminal && !enabled && !isEmptySlot) ? "blur(10px) saturate(120%)" : undefined,
                                            WebkitBackdropFilter: (!isTerminal && !enabled && !isEmptySlot) ? "blur(10px) saturate(120%)" : undefined,
                                            opacity: 1.0
                                        }}
                                        onContextMenu={(e) => { e.preventDefault(); }}
                                    >
                                        {/* Top Category Accent Strip for FX / NAM / Split blocks */}
                                        {!isTerminal && !isEmptySlot && (
                                            <div style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: 3.5,
                                                background: enabled ? catInfo.color : "rgba(148, 163, 184, 0.25)",
                                                boxShadow: enabled ? `0 0 10px ${catInfo.color}` : "none"
                                            }} />
                                        )}
                                        <SelectHoverBackground selected={isSelected} showHover={true}
                                            clipChildren={false}
                                        >
                                        </SelectHoverBackground>
                                    </div>
                                    {isTerminal ? (
                                        <div id="childIcon" style={{ position: "relative", margin: "auto", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }} >
                                            <PluginIcon pluginType={iconType}
                                                size={22}
                                                color={isSelected ? "#00E5FF" : getIconColor(iconColor)}
                                                pluginMissing={pluginNotFound}
                                            />
                                            <span style={{
                                                fontSize: "9px",
                                                fontWeight: 700,
                                                letterSpacing: "0.06em",
                                                marginTop: 2,
                                                color: isSelected ? "#00E5FF" : (isDarkMode() ? "#94A3B8" : "#475569")
                                            }}>
                                                {instanceId === START_CONTROL ? "IN" : "OUT"}
                                            </span>
                                        </div>
                                    ) : (
                                        <div style={{
                                            position: "relative",
                                            width: "100%",
                                            height: "100%",
                                            padding: "10px 9px 7px 9px",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            boxSizing: "border-box",
                                            opacity: (enabled || isEmptySlot) ? 0.99 : 0.45
                                        }}>
                                            {/* Header Row: Category Pill + Bypass LED */}
                                            <div style={{
                                                width: "100%",
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                paddingLeft: 2,
                                                paddingRight: 2
                                            }}>
                                                <span style={{
                                                    fontSize: "8.5px",
                                                    fontWeight: 800,
                                                    letterSpacing: "0.06em",
                                                    padding: "1.5px 5.5px",
                                                    borderRadius: 4,
                                                    background: isEmptySlot ? "rgba(148,163,184,0.12)" : `${catInfo.color}22`,
                                                    color: isEmptySlot ? "#94A3B8" : catInfo.color,
                                                    border: `1px solid ${isEmptySlot ? "rgba(148,163,184,0.2)" : `${catInfo.color}55`}`,
                                                    lineHeight: 1.2
                                                }}>
                                                    {catInfo.badge}
                                                </span>

                                                {!isEmptySlot && !isSplitNode && (
                                                    <div
                                                        title={enabled ? "Active (Click to select)" : "Bypassed"}
                                                        onClick={(ev) => {
                                                            ev.stopPropagation();
                                                            this.model.setPedalboardItemEnabled(instanceId, !enabled);
                                                            this.setSelection(instanceId);
                                                        }}
                                                        style={{
                                                            width: 9,
                                                            height: 9,
                                                            borderRadius: "50%",
                                                            background: enabled ? catInfo.color : "rgba(100, 116, 139, 0.35)",
                                                            boxShadow: enabled ? `0 0 8px 1px ${catInfo.color}` : "inset 0 1px 2px rgba(0,0,0,0.6)",
                                                            border: "1px solid rgba(255,255,255,0.25)",
                                                            cursor: "pointer"
                                                        }}
                                                    />
                                                )}
                                            </div>

                                            {/* Center Hardware Illustration or Icon */}
                                            <div id="childIcon" style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "auto", marginBottom: "auto" }} >
                                                {(this.props.hardwareView && !isEmptySlot && !isSplitNode && !pluginNotFound) ? (
                                                    renderHardwareIllustration(
                                                        catInfo.badge,
                                                        getIconColor(iconColor) || catInfo.color,
                                                        enabled
                                                    )
                                                ) : (
                                                    <PluginIcon pluginType={iconType}
                                                        size={30}
                                                        color={getIconColor(iconColor) || (enabled || isSplitNode ? catInfo.color : undefined)}
                                                        pluginMissing={pluginNotFound}
                                                    />
                                                )}
                                            </div>

                                            {/* Bottom Pedal / Model Title Inside Block */}
                                            <div style={{
                                                width: "100%",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                textAlign: "center",
                                                fontSize: "10.5px",
                                                fontWeight: isSelected ? 700 : 600,
                                                letterSpacing: "0.01em",
                                                color: isEmptySlot
                                                    ? "#64748B"
                                                    : (isDarkMode() ? (enabled ? "#F1F5F9" : "#94A3B8") : (enabled ? "#0F172A" : "#64748B")),
                                                lineHeight: 1.15
                                            }}>
                                                {isEmptySlot ? "+ Add Effect" : (isSplitNode ? catInfo.badge : pedalName)}
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            </ButtonBase>

                        </div>
                    );

                }
                renderConnectors(output: ReactNode[], layoutChain: PedalLayout[], enabled: boolean, shortSplitOutput: boolean): void {
                    let length = layoutChain.length - 1;
                    if (layoutChain.length > 0 && layoutChain[layoutChain.length - 1].isSplitter()) {
                        ++length;
                    }
                    for (let i = 0; i < length; ++i) {
                        let item = layoutChain[i];
                        if (item.isSplitter()) {
                            let splitter = item.pedalItem as PedalboardSplitItem;
                            this.renderSplitConnectors(output, item, enabled, i === length - 1 && shortSplitOutput,);
                            this.renderConnectors(output, item.topChildren, enabled && splitter.isASelected(), false);
                            this.renderConnectors(output, item.bottomChildren, enabled && splitter.isBSelected(), false);

                        } else if (item.uri !== END_PEDALBOARD_ITEM_URI) {
                            this.renderConnector(output, item, enabled);

                        }
                    }
                }
                renderConnectorFrame(layoutChain: PedalLayout[], layoutSize: LayoutSize): ReactNode {
                    let outputs: ReactNode[] = [];
                    this.renderConnectors(outputs, layoutChain, true, false);
                    return (
                        <div key="connectors" style={{ width: layoutSize.width, height: layoutSize.height, overflow: "hidden" }}>
                            <svg width={layoutSize.width} height={layoutSize.height}
                                xmlns="http://www.w3.org/2000/svg" viewBox={"0 0 " + layoutSize.width + " " + layoutSize.height}>
                                <g fill="none">
                                    {
                                        outputs
                                    }
                                </g>

                            </svg>
                        </div>
                    );

                }

                renderDropPreview(layoutChain: PedalLayout[]): ReactNode {
                    let preview = this.state.dropPreview;
                    let draggingId = this.state.draggingInstanceId;
                    if (!preview || draggingId === null) return null;

                    let draggedLayout: PedalLayout | null = null;
                    let it = chainIterator(layoutChain);
                    while (true) {
                        let v = it.next();
                        if (v.done) break;
                        if (v.value.pedalItem?.instanceId === draggingId) {
                            draggedLayout = v.value;
                            break;
                        }
                    }
                    if (!draggedLayout) return null;

                    let pluginType = draggedLayout.pluginType;
                    if (draggedLayout.uri === "http://two-play.com/plugins/toob-nam") {
                        pluginType = PluginType.NamPlugin;
                    }
                    if (draggedLayout.isSplitter()) {
                        pluginType = this.getSplitterIcon(draggedLayout);
                    }
                    let isSplitNode = draggedLayout.isSplitter();
                    let iconColor = draggedLayout.pedalItem?.iconColor ?? "";
                    let catInfo = getPluginCategoryInfo(pluginType, iconColor, draggedLayout.uri);

                    let left = preview.previewX - CARD_WIDTH / 2;
                    let top = preview.previewY + (CELL_HEIGHT - CARD_HEIGHT) / 2;

                    return (
                        <div
                            key="drop-preview-ghost"
                            style={{
                                position: "absolute",
                                left: left,
                                top: top,
                                width: CARD_WIDTH,
                                height: CARD_HEIGHT,
                                borderRadius: 12,
                                border: `2px dashed ${catInfo.color}`,
                                background: isDarkMode()
                                    ? `linear-gradient(180deg, ${catInfo.color}28 0%, rgba(19, 23, 34, 0.88) 100%)`
                                    : `linear-gradient(180deg, ${catInfo.color}22 0%, rgba(255, 255, 255, 0.9) 100%)`,
                                boxShadow: `0 0 20px 2px ${catInfo.glow}`,
                                transform: "scale(0.84)",
                                transition: "left 0.18s cubic-bezier(0.22, 1, 0.36, 1), top 0.18s cubic-bezier(0.22, 1, 0.36, 1), transform 0.18s ease",
                                zIndex: 2,
                                pointerEvents: "none",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "10px 9px 7px 9px",
                                boxSizing: "border-box",
                                opacity: 0.92
                            }}
                        >
                            <div style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <span style={{
                                    fontSize: "8px",
                                    fontWeight: 800,
                                    letterSpacing: "0.06em",
                                    padding: "1px 5px",
                                    borderRadius: 4,
                                    background: `${catInfo.color}33`,
                                    color: catInfo.color,
                                    border: `1px solid ${catInfo.color}66`
                                }}>
                                    {catInfo.badge}
                                </span>
                                <span style={{
                                    fontSize: "8px",
                                    fontWeight: 800,
                                    letterSpacing: "0.05em",
                                    color: "#00E5FF"
                                }}>
                                    INSERT
                                </span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "auto", marginBottom: "auto", opacity: 0.9 }}>
                                {(this.props.hardwareView && !isSplitNode) ? (
                                    renderHardwareIllustration(
                                        catInfo.badge,
                                        getIconColor(iconColor) || catInfo.color,
                                        true
                                    )
                                ) : (
                                    <PluginIcon
                                        pluginType={pluginType}
                                        size={28}
                                        color={getIconColor(iconColor) || catInfo.color}
                                        pluginMissing={false}
                                    />
                                )}
                            </div>
                            <div style={{
                                width: "100%",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                textAlign: "center",
                                fontSize: "10px",
                                fontWeight: 700,
                                color: isDarkMode() ? "#F8FAFC" : "#0F172A"
                            }}>
                                {isSplitNode ? catInfo.badge : draggedLayout.name}
                            </div>
                        </div>
                    );
                }

                getItemShiftTransform(item: PedalLayout): string | undefined {
                    let preview = this.state.dropPreview;
                    if (!preview) return undefined;
                    if (Math.abs(item.bounds.y - preview.previewY) > CELL_HEIGHT * 0.6) {
                        return undefined;
                    }
                    let itemCenterX = item.bounds.x + CELL_WIDTH / 2;
                    let shiftPx = 34;
                    if (itemCenterX < preview.previewX) {
                        return `translateX(-${shiftPx}px)`;
                    } else {
                        return `translateX(${shiftPx}px)`;
                    }
                }

                renderChain(layoutChain: PedalLayout[], layoutSize: LayoutSize): ReactNode {

                    const classes = withStyles.getClasses(this.props);

                    let result: ReactNode[] = [];

                    result.push(this.renderConnectorFrame(layoutChain, layoutSize));
                    let ghostPreview = this.renderDropPreview(layoutChain);
                    if (ghostPreview) {
                        result.push(ghostPreview);
                    }

                    let it = chainIterator(layoutChain);
                    while (true) {
                        let v = it.next();
                        if (v.done) break;
                        let item = v.value;
                        let shiftTransform = this.getItemShiftTransform(item);
                        let isBeingDragged = item.pedalItem !== undefined && item.pedalItem.instanceId === this.state.draggingInstanceId;
                        let itemZIndex = isBeingDragged ? 20 : 1;
                        let itemTransition = "transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)";
                        switch (item.uri) {
                            case START_PEDALBOARD_ITEM_URI:
                                result.push(<div key={"start-node"} className={classes.splitItem} style={{ left: item.bounds.x, top: item.bounds.y, width: item.bounds.width, zIndex: itemZIndex, transform: shiftTransform, transition: itemTransition }} >
                                    <div className={classes.splitStart} >

                                        {this.pedalButton(START_CONTROL, item.pluginType, item.iconColor, false, true, false, false, false)}
                                    </div>
                                </div>);
                                break;
                            case END_PEDALBOARD_ITEM_URI:
                                result.push(<div key={"end-node"} className={classes.splitItem} style={{ left: item.bounds.x, top: item.bounds.y, width: item.bounds.width, zIndex: itemZIndex, transform: shiftTransform, transition: itemTransition }} >
                                    <div className={classes.splitStart} >

                                        {this.pedalButton(END_CONTROL, item.pluginType, "", false, true, false, false, false)}
                                    </div>
                                </div>);
                                break;
                            default:
                                if (item.isSplitter()) {

                                    result.push(<div key={"split-" + (item.pedalItem?.instanceId ?? this.renderKey++)} className={classes.splitItem} style={{ left: item.bounds.x, top: item.bounds.y, width: item.bounds.width, zIndex: itemZIndex, transform: shiftTransform, transition: itemTransition }} >
                                        <div className={classes.splitStart} >
                                            {this.pedalButton(item.pedalItem?.instanceId ?? -1, this.getSplitterIcon(item), "", true, true, true, false, false)}
                                        </div>
                                    </div>);

                                } else {
                                    let uiPlugin = this.model.getUiPlugin(item.pedalItem?.uri ?? "");
                                    let pluginMissing = uiPlugin === null;
                                    let pluginType = item.pluginType;
                                    if (uiPlugin && uiPlugin.uri === "http://two-play.com/plugins/toob-nam") {
                                        pluginType = PluginType.NamPlugin;

                                    }

                                    result.push(<div key={"pedal-" + (item.pedalItem?.instanceId ?? this.renderKey++)} className={classes.pedalItem} style={{ left: item.bounds.x, top: item.bounds.y, zIndex: itemZIndex, transform: shiftTransform, transition: itemTransition }} >
                                        {this.pedalButton(
                                            item.pedalItem?.instanceId ?? -1,
                                            pluginType,
                                            item.pedalItem?.iconColor ?? "",
                                            !item.isEmpty(),
                                            item.pedalItem?.isEnabled ?? false,
                                            true,
                                            pluginMissing,
                                            uiPlugin ? ((uiPlugin.has_midi_input !== 0) || (uiPlugin.has_midi_output !== 0)) : false,
                                            item.name,
                                            item.pedalItem?.uri ?? "")}

                                    </div>);

                                }
                                break;
                        }

                    }
                    return result;
                }

                canInputStero(item: PedalLayout): boolean {
                    if (item.pedalItem) {
                        let plugin = this.model.getUiPlugin(item.pedalItem.uri);
                        if (plugin) {
                            return plugin.audio_inputs === 2;
                        }
                    }
                    return true;
                }
                getNumberOfInputs(item: PedalLayout): number {
                    if (item.pedalItem) {
                        let plugin = this.model.getUiPlugin(item.pedalItem.uri);
                        if (plugin) {
                            return plugin.audio_inputs;
                        }
                    }
                    return 1;
                }
                getNumberOfOutputs(item: PedalLayout): number {
                    if (item.pedalItem) {
                        let plugin = this.model.getUiPlugin(item.pedalItem.uri);
                        if (plugin) {
                            return plugin.audio_outputs;
                        }
                    }
                    return 1;
                }

                markStereoOutputs(layoutChain: PedalLayout[], numberOfInputs: number, numberOfOutputs: number) {
                    // analyze forward flow.
                    this.markStereoForward(layoutChain, numberOfInputs);
                    // mark items that feed a mono effect as mono.
                    this.markStereoBackward(layoutChain, numberOfOutputs);
                }

                markStereoBackward(layoutChain: PedalLayout[], numberOfOutputs: number): number {
                    for (let i = layoutChain.length - 1; i >= 0; --i) {
                        let item = layoutChain[i];
                        if (item.isSplitter()) {
                            item.numberOfOutputs = CalculateConnection(item.numberOfOutputs, numberOfOutputs)

                            this.markStereoBackward(item.topChildren, numberOfOutputs);
                            this.markStereoBackward(item.bottomChildren, numberOfOutputs);
                            let topInputs = item.topChildren[0].numberOfInputs;
                            let bottomInputs = item.bottomChildren[0].numberOfInputs;

                            let splitItem = item.pedalItem as PedalboardSplitItem;
                            if (splitItem.getSplitType() !== SplitType.Lr) {
                                item.numberOfInputs = CalculateConnection(item.numberOfInputs, Math.max(topInputs, bottomInputs));
                            }
                        } else if (item.isEnd()) {

                        } else if (item.isStart()) {
                            item.numberOfOutputs = CalculateConnection(item.numberOfOutputs, numberOfOutputs);
                            return item.numberOfOutputs;

                        } else if (item.isEmpty()) {
                            if (numberOfOutputs === 0) {
                                item.numberOfOutputs = 0;
                                item.numberOfInputs = CalculateConnection(item.numberOfInputs, 2);
                            } else {
                                item.numberOfOutputs = CalculateConnection(item.numberOfOutputs, numberOfOutputs);
                                item.numberOfInputs = CalculateConnection(item.numberOfInputs, numberOfOutputs);
                            }
                        } else {
                            item.numberOfOutputs = CalculateConnection(item.numberOfOutputs, numberOfOutputs);
                        }
                        numberOfOutputs = item.numberOfInputs;
                    }
                    return numberOfOutputs;
                }
                markStereoForward(layoutChain: PedalLayout[], numberOfInputs: number): number {
                    if (layoutChain.length === 0) {
                        return numberOfInputs;
                    }
                    for (let i = 0; i < layoutChain.length; ++i) {
                        let item = layoutChain[i];
                        if (item.isSplitter()) {
                            let splitter = item.pedalItem as PedalboardSplitItem;
                            item.numberOfInputs = numberOfInputs;

                            let chainInputs = numberOfInputs;
                            if (splitter.getSplitType() === SplitType.Lr) {
                                chainInputs = CalculateConnection(numberOfInputs, 1);
                            }
                            let topOutputs = this.markStereoForward(item.topChildren, chainInputs);
                            let bottomOutputs = this.markStereoForward(item.bottomChildren, chainInputs);


                            if (splitter.getSplitType() === SplitType.Ab) {
                                if (splitter.isASelected()) {
                                    item.numberOfOutputs = topOutputs;
                                } else {
                                    item.numberOfOutputs = bottomOutputs;
                                }
                            } else {
                                item.numberOfOutputs = (topOutputs >= 1 || bottomOutputs >= 1) ? 2 : 1;
                            }
                        } else if (item.isStart()) {
                            item.numberOfOutputs = Math.min(PiPedalModelFactory.getInstance().jackSettings.get().inputAudioPorts.length, 2);
                        } else if (item.isEnd()) {
                            item.numberOfInputs =
                                CalculateConnection(
                                    Math.min(PiPedalModelFactory.getInstance().jackSettings.get().outputAudioPorts.length, 2),
                                    numberOfInputs);
                            return item.numberOfInputs;
                        } else if (item.isEmpty()) {
                            item.numberOfInputs = numberOfInputs;
                            if (numberOfInputs === 0) {
                                item.numberOfOutputs = 2;
                            } else {
                                item.numberOfOutputs = item.numberOfInputs;
                            }
                        } else {
                            if (item.numberOfInputs === 0) // zero-input plugins merge their output with the input.
                            {
                                item.numberOfInputs = numberOfInputs;
                                item.numberOfOutputs = Math.max(item.numberOfOutputs, numberOfInputs);
                            } else {
                                item.numberOfInputs = CalculateConnection(numberOfInputs, this.getNumberOfInputs(item));
                                item.numberOfOutputs = this.getNumberOfOutputs(item);
                            }
                        }
                        numberOfInputs = item.numberOfOutputs;
                    }
                    return numberOfInputs;
                }

                currentLayout?: PedalLayout[];
                private lastReportedWidth: number = 0;
                private lastReportedHeight: number = 0;
                private renderKey: number = 0;
                render() {
                    const classes = withStyles.getClasses(this.props);
                    this.renderKey = 0;
                    let layoutChain = makeChain(this.model, this.state.pedalboard?.items);
                    let start = PedalLayout.Start();
                    let end = PedalLayout.End();
                    if (layoutChain.length !== 0) {
                        layoutChain.splice(0, 0, start);
                        layoutChain.splice(layoutChain.length, 0, end);
                        this.markStereoOutputs(layoutChain, 2, 2);
                    }

                    let layoutSize = this.doLayout(layoutChain);
                    if (this.props.onLayoutSizeChanged && (layoutSize.width !== this.lastReportedWidth || layoutSize.height !== this.lastReportedHeight)) {
                        this.lastReportedWidth = layoutSize.width;
                        this.lastReportedHeight = layoutSize.height;
                        let cb = this.props.onLayoutSizeChanged;
                        let w = layoutSize.width;
                        let h = layoutSize.height;
                        setTimeout(() => cb(w, h), 0);
                    }
                    let zoom = this.props.chainZoom ?? 1.0;
                    let panX = this.state.panX;
                    let panY = this.state.panY;
                    let isDragging = this.state.draggingInstanceId !== null;
                    let overTrash = this.state.isOverTrash;


                    this.currentLayout = layoutChain; // save for mouse processing &c.

                    return (
                        <div className={classes.scrollContainer} ref={this.scrollRef}
                            onPointerDown={this.onStagePointerDown}
                            onPointerMove={this.onStagePointerMove}
                            onPointerUp={this.onStagePointerUp}
                            onPointerCancel={this.onStagePointerUp}
                            onWheel={this.onStageWheel}
                            style={{
                                position: "relative",
                                cursor: this.state.isPanning ? "grabbing" : "grab",
                                userSelect: "none",
                                touchAction: "none"
                            }}
                        >
                            <div id="pedalboardChainSizeBox"
                                className={classes.container}
                                ref={this.frameRef}
                                data-raw-width={layoutSize.width}
                                data-raw-height={layoutSize.height}
                                style={{
                                    left: "50%",
                                    top: "50%",
                                    width: layoutSize.width,
                                    height: layoutSize.height,
                                    transform: `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${zoom})`,
                                    transformOrigin: "center center"
                                }} >
                                {this.renderChain(layoutChain, layoutSize)}
                            </div>
                            {/* Trash Drop Target Zone when dragging an effect block */}
                            <div
                                ref={this.trashRef}
                                style={{
                                    position: "fixed",
                                    left: "50%",
                                    top: 76,
                                    transform: isDragging
                                        ? `translateX(-50%) scale(${overTrash ? 1.12 : 1.0})`
                                        : "translateX(-50%) translateY(-16px) scale(0.85)",
                                    opacity: isDragging ? 1 : 0,
                                    pointerEvents: "none",
                                    zIndex: 30,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 7,
                                    padding: "7px 16px",
                                    borderRadius: 999,
                                    background: overTrash
                                        ? "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
                                        : (isDarkMode() ? "rgba(23, 28, 42, 0.94)" : "rgba(255, 255, 255, 0.95)"),
                                    border: overTrash
                                        ? "1.5px solid #FCA5A5"
                                        : "1.5px dashed rgba(239, 68, 68, 0.65)",
                                    boxShadow: overTrash
                                        ? "0 0 24px rgba(239, 68, 68, 0.75), 0 8px 20px rgba(0, 0, 0, 0.6)"
                                        : "0 6px 18px rgba(0, 0, 0, 0.55)",
                                    color: overTrash ? "#FFFFFF" : "#F87171",
                                    transition: "all 0.16s cubic-bezier(0.22, 1, 0.36, 1)"
                                }}
                            >
                                <DeleteOutlineIcon style={{ width: 18, height: 18 }} />
                                <span style={{
                                    fontSize: "11px",
                                    fontWeight: 800,
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase"
                                }}>
                                    {overTrash ? "Release to Delete" : "Drag Here to Remove"}
                                </span>
                            </div>
                        </div>
                    );
                }

            },
            pedalboardStyles
        ));

export default PedalboardView