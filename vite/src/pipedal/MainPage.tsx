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

import { SyntheticEvent } from 'react';
import { Theme } from '@mui/material/styles';
import WithStyles, { withTheme } from './WithStyles';
import { withStyles } from "tss-react/mui";
import IconButtonEx from './IconButtonEx';
import ButtonEx from './ButtonEx';
import ButtonBase from '@mui/material/ButtonBase';
import PluginIcon, { getIconColor, getPluginCategoryInfo } from './PluginIcon';
import { PluginType } from './Lv2Plugin';

import ToolTipEx from './ToolTipEx';
import { PiPedalModel, PiPedalModelFactory } from './PiPedalModel';
import {
    Pedalboard, PedalboardItem, PedalboardSplitItem, SplitType
} from './Pedalboard';
import InputIcon from '@mui/icons-material/Input';
import LoadPluginDialog from './LoadPluginDialog';
import Typography from '@mui/material/Typography';

import PedalboardView from './PedalboardView';
import { PiPedalStateError } from './PiPedalError';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import Slider from '@mui/material/Slider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import Divider from '@mui/material/Divider';
import ResizeResponsiveComponent from './ResizeResponsiveComponent';
import PluginInfoDialog from './PluginInfoDialog';
import { GetControlView } from './ControlViewFactory';
import MidiBindingsDialog from './MidiBindingsDialog';
import PluginPresetSelector from './PluginPresetSelector';
import OldDeleteIcon from "./svg/old_delete_outline_24dp.svg?react";
import MidiIcon from "./svg/ic_midi.svg?react";
import { isDarkMode } from './DarkMode';
import Snapshot0Icon from "./svg/snapshot_0.svg?react";
import Snapshot1Icon from "./svg/snapshot_1.svg?react";
import Snapshot2Icon from "./svg/snapshot_2.svg?react";
import Snapshot3Icon from "./svg/snapshot_3.svg?react";
import Snapshot4Icon from "./svg/snapshot_4.svg?react";
import Snapshot5Icon from "./svg/snapshot_5.svg?react";
import Snapshot6Icon from "./svg/snapshot_6.svg?react";
import ModUiIcon from './svg/mod_ui.svg?react';
import PipedalUiIcon from './svg/pp_ui.svg?react';

import SnapshotDialog from './SnapshotDialog';
import { css } from '@emotion/react';
import { setDefaultModGuiPreference } from './ModGuiHost';
import PluginNameDialog from './PluginNameDialog';


const SPLIT_CONTROLBAR_THRESHHOLD = 750;
const SHOW_ICON_THRESHHOLD = 475;
const DISPLAY_AUTHOR_THRESHHOLD = 750;
const DISPLAY_AUTHOR_SPLIT_THRESHOLD = 500;
const HORIZONTAL_CONTROL_SCROLL_HEIGHT_BREAK = 500;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const HORIZONTAL_LAYOUT_MQ = "@media (max-height: " + HORIZONTAL_CONTROL_SCROLL_HEIGHT_BREAK + "px)";

const styles = ({ palette }: Theme) => {
    return {
        frame: css({
            position: "absolute", display: "flex", flexDirection: "column", flexWrap: "nowrap",
            justifyContent: "flex-start", left: "0px", top: "0px", bottom: "0px", right: "0px", overflow: "hidden",
            background: isDarkMode()
                ? "radial-gradient(ellipse at 50% 0%, #161C2B 0%, #0B0D13 70%)"
                : "#F8FAFC"
        }),
        pedalboardStageWrapper: css({
            position: "relative",
            width: "100%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            backgroundImage: isDarkMode()
                ? "radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px)"
                : "radial-gradient(rgba(15, 23, 42, 0.06) 1px, transparent 1px)",
            backgroundSize: "20px 20px"
        }),
        pedalboardScroll: css({
            position: "relative", width: "100%", height: "100%",
            flex: "1 1 auto", overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center"
        }),
        pedalboardScrollSmall: css({
            position: "relative", width: "100%", height: "100%",
            flex: "1 1 1px", overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center"
        }),
        separator: css({
            width: "100%", height: "1px",
            background: isDarkMode() ? "rgba(255, 255, 255, 0.08)" : "rgba(15, 23, 42, 0.12)",
            flex: "0 0 1px"
        }),

        controlToolBar: css({
            flex: "0 0 auto", width: "100%", height: 54,
            background: isDarkMode()
                ? "linear-gradient(180deg, rgba(26, 33, 48, 0.95) 0%, rgba(17, 22, 33, 0.95) 100%)"
                : "linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)",
            borderBottom: isDarkMode() ? "1px solid rgba(255, 255, 255, 0.07)" : "1px solid rgba(15, 23, 42, 0.08)"
        }),
        splitControlBar: css({
            flex: "0 0 56px", width: "100%", paddingLeft: 20, paddingRight: 16, paddingBottom: 8,
            background: isDarkMode() ? "rgba(17, 22, 33, 0.95)" : "#F1F5F9",
            borderBottom: isDarkMode() ? "1px solid rgba(255, 255, 255, 0.07)" : "1px solid rgba(15, 23, 42, 0.08)"
        }),
        controlContent: css({
            flex: "1 1 0px", width: "100%", minHeight: 90, position: "relative", overflow: "hidden",
            background: isDarkMode()
                ? "linear-gradient(180deg, #111520 0%, #0B0E15 100%)"
                : "#FFFFFF"
        }),
        controlContentSmall: css({
            flex: "1 1 0px", width: "100%", minHeight: 90, position: "relative", overflow: "hidden",
            background: isDarkMode()
                ? "linear-gradient(180deg, #111520 0%, #0B0E15 100%)"
                : "#FFFFFF"
        }),
        title: css({
            fontSize: "1.08rem",
            fontWeight: 700,
            letterSpacing: "0.01em",
            marginRight: 10,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: isDarkMode() ? "#F8FAFC" : "#0F172A"
        }),
        author: css({
            fontWeight: 500,
            fontSize: "0.78rem",
            marginRight: 8,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: isDarkMode() ? "#94A3B8" : "#64748B"
        })
    }
};



interface MainProps extends WithStyles<typeof styles> {
    hasTinyToolBar: boolean;
    theme: Theme;
    enableStructureEditing: boolean;
}

interface MainState {
    selectedPedal: number;
    selectedSnapshot: number;
    loadDialogOpen: boolean;
    snapshotDialogOpen: boolean;
    pedalboard: Pedalboard;
    addMenuAnchorEl: HTMLElement | null;
    splitControlBar: boolean;
    displayAuthor: boolean;
    horizontalScrollLayout: boolean;
    canDisplayPluginIcon: boolean;
    showMidiBindingsDialog: boolean;
    screenHeight: number;
    displayNameDialogOpen: boolean;
    showModUi: boolean;
    hardwareChainView: boolean;
    chainZoom: number;
    panX: number;
    panY: number;
    centerViewSeq: number;
    stageHeight: number;
    isResizingStage: boolean;
}


export const MainPage =
    withTheme(
        withStyles(
            class extends ResizeResponsiveComponent<MainProps, MainState> {
                model: PiPedalModel;

                getSplitToolbar() {
                    return this.windowSize.width < SPLIT_CONTROLBAR_THRESHHOLD && this.windowSize.height >= HORIZONTAL_CONTROL_SCROLL_HEIGHT_BREAK;
                }
                getShowPluginIcon() {
                    return this.windowSize.width > SHOW_ICON_THRESHHOLD;
                }
                getDisplayAuthor() {
                    if (this.getSplitToolbar()) {
                        return this.windowSize.width >= DISPLAY_AUTHOR_SPLIT_THRESHOLD;
                    } else {
                        return this.windowSize.width >= DISPLAY_AUTHOR_THRESHHOLD;
                    }
                }
                constructor(props: MainProps) {
                    super(props);
                    this.model = PiPedalModelFactory.getInstance();
                    let pedalboard = this.model.pedalboard.get();
                    let selectedPedal = pedalboard.selectedPlugin;
                    if (selectedPedal === -1) {
                        selectedPedal = pedalboard.getFirstSelectableItem();
                    }

                    this.state = {
                        selectedPedal: selectedPedal,
                        selectedSnapshot: -1,
                        loadDialogOpen: false,
                        snapshotDialogOpen: false,
                        displayNameDialogOpen: false,
                        pedalboard: pedalboard,
                        addMenuAnchorEl: null,
                        splitControlBar: this.getSplitToolbar(),
                        displayAuthor: this.getDisplayAuthor(),
                        canDisplayPluginIcon: this.getShowPluginIcon(),
                        horizontalScrollLayout: this.windowSize.height < HORIZONTAL_CONTROL_SCROLL_HEIGHT_BREAK,
                        showMidiBindingsDialog: false,
                        screenHeight: this.windowSize.height,
                        showModUi: false,
                        hardwareChainView: window.localStorage.getItem("pipedal_hardware_chain_view") !== "false",
                        chainZoom: parseFloat(window.localStorage.getItem("pipedal_chain_zoom") || "1.0") || 1.0,
                        panX: 0,
                        panY: 0,
                        centerViewSeq: 0,
                        stageHeight: parseInt(window.localStorage.getItem("pipedal_stage_height") || "250", 10) || 250,
                        isResizingStage: false
                    };
                    this.onSelectionChanged = this.onSelectionChanged.bind(this);
                    this.onPedalDoubleClick = this.onPedalDoubleClick.bind(this);
                    this.onLoadClick = this.onLoadClick.bind(this);
                    this.onLoadOk = this.onLoadOk.bind(this);
                    this.onLoadCancel = this.onLoadCancel.bind(this);
                    this.onPedalboardChanged = this.onPedalboardChanged.bind(this);
                    this.onSelectedSnapshotChanged = this.onSelectedSnapshotChanged.bind(this);
                    this.handleEnableCurrentItemChanged = this.handleEnableCurrentItemChanged.bind(this);
                    this.handlePanChange = this.handlePanChange.bind(this);
                    this.handleWheelZoom = this.handleWheelZoom.bind(this);
                    this.handleCenterView = this.handleCenterView.bind(this);
                    this.handleLayoutSizeChanged = this.handleLayoutSizeChanged.bind(this);
                    this.onStageResizePointerDown = this.onStageResizePointerDown.bind(this);
                    this.onStageResizePointerMove = this.onStageResizePointerMove.bind(this);
                    this.onStageResizePointerUp = this.onStageResizePointerUp.bind(this);
                }

                private resizeStartY: number = 0;
                private resizeStartHeight: number = 250;
                private chainRawWidth: number = 780;
                private chainRawHeight: number = 128;

                handleLayoutSizeChanged(width: number, height: number) {
                    this.chainRawWidth = width;
                    this.chainRawHeight = height;
                }

                handlePanChange(panX: number, panY: number) {
                    this.setState({ panX, panY });
                }

                handleWheelZoom(deltaZoom: number) {
                    let nextZoom = Math.min(1.45, Math.max(0.65, Math.round((this.state.chainZoom + deltaZoom) * 100) / 100));
                    window.localStorage.setItem("pipedal_chain_zoom", nextZoom.toString());
                    this.setState({ chainZoom: nextZoom });
                }

                handleCenterView() {
                    let scrollEl = document.getElementById("pedalboardScroll");
                    let sizeBoxEl = document.getElementById("pedalboardChainSizeBox");
                    let rawW = this.chainRawWidth;
                    let rawH = this.chainRawHeight;
                    if (sizeBoxEl) {
                        let attrW = parseFloat(sizeBoxEl.getAttribute("data-raw-width") || "0");
                        let attrH = parseFloat(sizeBoxEl.getAttribute("data-raw-height") || "0");
                        if (attrW > 10) rawW = attrW;
                        if (attrH > 10) rawH = attrH;
                    }
                    let bestZoom = this.state.chainZoom;
                    if (scrollEl && rawW > 10 && rawH > 10) {
                        // Symmetrical 64px horizontal clearance on both left and right so centered at panX=0 never overlaps the right-side zoom bar
                        let availW = Math.max(240, scrollEl.clientWidth - 128);
                        let availH = Math.max(110, scrollEl.clientHeight - 36);
                        let fitZoom = Math.min(availW / rawW, availH / rawH);
                        bestZoom = Math.min(1.45, Math.max(0.65, Math.floor(fitZoom * 20) / 20));
                    }
                    window.localStorage.setItem("pipedal_chain_zoom", bestZoom.toString());
                    this.setState({
                        panX: 0,
                        panY: 0,
                        chainZoom: bestZoom,
                        centerViewSeq: this.state.centerViewSeq + 1
                    });
                    if (scrollEl) {
                        scrollEl.scrollLeft = 0;
                        scrollEl.scrollTop = 0;
                    }
                }

                onStageResizePointerDown(e: React.PointerEvent<HTMLDivElement>) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.resizeStartY = e.clientY;
                    this.resizeStartHeight = this.state.stageHeight;
                    this.setState({ isResizingStage: true });
                    try {
                        e.currentTarget.setPointerCapture(e.pointerId);
                    } catch (_err) {
                        // ignore
                    }
                }

                onStageResizePointerMove(e: React.PointerEvent<HTMLDivElement>) {
                    if (!this.state.isResizingStage) return;
                    let dy = e.clientY - this.resizeStartY;
                    let maxStageH = Math.max(180, this.state.screenHeight - 160);
                    let nextHeight = Math.min(maxStageH, Math.max(135, Math.round(this.resizeStartHeight + dy)));
                    this.setState({ stageHeight: nextHeight });
                }

                onStageResizePointerUp(e: React.PointerEvent<HTMLDivElement>) {
                    if (!this.state.isResizingStage) return;
                    this.setState({ isResizingStage: false });
                    window.localStorage.setItem("pipedal_stage_height", this.state.stageHeight.toString());
                    try {
                        e.currentTarget.releasePointerCapture(e.pointerId);
                    } catch (_err) {
                        // ignore
                    }
                }

                handleEditPluginDisplayName() {
                    this.setState({ displayNameDialogOpen: true });
                }
                onInsertPedal(instanceId: number) {
                    this.setAddMenuAnchorEl(null);
                    let newId = this.model.addPedalboardItem(instanceId, false);
                    this.setSelection(newId);
                }
                onAppendPedal(instanceId: number) {
                    this.setAddMenuAnchorEl(null);
                    let newId = this.model.addPedalboardItem(instanceId, true);

                    this.setSelection(newId);

                }
                onInsertSplit(instanceId: number) {
                    this.setAddMenuAnchorEl(null);
                    let newId = this.model.addPedalboardSplitItem(instanceId, false);
                    this.setSelection(newId);

                }
                onAppendSplit(instanceId: number) {
                    this.setAddMenuAnchorEl(null);
                    let newId = this.model.addPedalboardSplitItem(instanceId, true);
                    this.setSelection(newId);

                }
                setAddMenuAnchorEl(value: HTMLElement | null) {
                    this.setState({ addMenuAnchorEl: value });
                }
                onAddClick(e: SyntheticEvent) {
                    this.setAddMenuAnchorEl(e.currentTarget as HTMLElement);
                }

                handleMidiBindingsDialogClose() {
                    this.setState({ showMidiBindingsDialog: false })
                }
                handleAddClose(): void {
                    this.setAddMenuAnchorEl(null);
                }

                handleMidiConfiguration(instanceId: number): void {
                    this.setState({ showMidiBindingsDialog: true });
                }
                handleEnableCurrentItemChanged(event: any): void {
                    let newValue = event.target.checked;
                    let item = this.getSelectedPedalboardItem();
                    if (item != null) {
                        this.model.setPedalboardItemEnabled(item.getInstanceId(), newValue);

                    }
                }
                handleSelectPluginPreset(instanceId: number, presetInstanceId: number) {
                    this.model.loadPluginPreset(instanceId, presetInstanceId);
                }
                onPedalboardChanged(value: Pedalboard) {
                    // let selectedItem = -1;
                    // if (this.state.selectedPedal === Pedalboard.START_CONTROL || this.state.selectedPedal === Pedalboard.END_CONTROL) {
                    //     selectedItem = this.state.selectedPedal;
                    // } else if (value.hasItem(this.state.selectedPedal)) {
                    //     selectedItem = this.state.selectedPedal;
                    // } else {
                    //     selectedItem = value.getFirstSelectableItem();
                    // }
                    let selectedItem = value.selectedPlugin;
                    if (selectedItem !== -2 && selectedItem !== -3) // start and end nodes.
                    {
                        if (selectedItem === -1 || !value.hasItem(selectedItem)) {
                            selectedItem = value.getFirstSelectableItem();
                        }
                    }
                    this.setState({
                        pedalboard: value,
                        selectedPedal: selectedItem,
                        showModUi: value.maybeGetItem(selectedItem)?.useModUi ?? false,
                        selectedSnapshot: value.selectedSnapshot
                    });
                }
                onSelectedSnapshotChanged(selectedSnapshot: number) {
                    this.setState({
                        selectedSnapshot: selectedSnapshot
                    });

                }
                onDeletePedal(instanceId: number): void {
                    // ok.
                    let result = this.model.deletePedalboardPedal(instanceId);
                    if (result != null)
                        this.setSelection(result); {
                    }
                }

                componentDidMount() {
                    super.componentDidMount();
                    this.model.pedalboard.addOnChangedHandler(this.onPedalboardChanged);
                    this.model.selectedSnapshot.addOnChangedHandler(this.onSelectedSnapshotChanged);
                }
                componentWillUnmount() {
                    this.model.selectedSnapshot.removeOnChangedHandler(this.onSelectedSnapshotChanged);
                    this.model.pedalboard.removeOnChangedHandler(this.onPedalboardChanged);
                    super.componentWillUnmount();
                }

                componentDidUpdate(prevProps: MainProps, prevState: MainState) {
                    if (prevState.selectedPedal !== this.state.selectedPedal
                        || prevState.pedalboard !== this.state.pedalboard
                    ) {
                        this.setState({ showModUi: this.state.pedalboard.maybeGetItem(this.state.selectedPedal)?.useModUi ?? false });
                    }
                }
                updateResponsive() {
                    this.setState({
                        splitControlBar: this.getSplitToolbar(),
                        displayAuthor: this.getDisplayAuthor(),
                        canDisplayPluginIcon: this.getShowPluginIcon(),
                        horizontalScrollLayout: this.windowSize.height < HORIZONTAL_CONTROL_SCROLL_HEIGHT_BREAK,
                        screenHeight: this.windowSize.height
                    });
                }
                onWindowSizeChanged(width: number, height: number): void {
                    super.onWindowSizeChanged(width, height);
                    this.updateResponsive();
                }


                setSelection(selectedId_: number): void {
                    this.setState({ selectedPedal: selectedId_ });
                    if (this.state.pedalboard.selectedPlugin !== selectedId_) {
                        this.model.setPedalboardSelectedPlugin(selectedId_);
                        this.state.pedalboard.selectedPlugin = selectedId_;
                    }
                }

                onSelectionChanged(selectedId: number): void {
                    this.setSelection(selectedId);
                }
                onPedalDoubleClick(selectedId: number): void {
                    this.setSelection(selectedId);
                    let item = this.getPedalboardItem(selectedId);
                    if (item != null) {
                        if (item.isStart() || item.isEnd()) {
                            // do nothing.
                        } else if (item.isSplit()) {
                            let split = item as PedalboardSplitItem;
                            if (split.getSplitType() === SplitType.Ab) {
                                let cv = split.getToggleAbControlValue();
                                if (split.instanceId === undefined) throw new PiPedalStateError("Split without valid id.");
                                this.model.setPedalboardControl(split.instanceId, cv.key, cv.value);
                            }
                        } else {
                            this.setState({ loadDialogOpen: true });
                        }
                    }
                }
                onLoadCancel(): void {
                    this.setState({ loadDialogOpen: false });
                }
                onLoadOk(selectedUri: string): void {
                    this.setState({ loadDialogOpen: false });
                    let itemId = this.state.selectedPedal;
                    let newSelectedItem = this.model.loadPedalboardPlugin(itemId, selectedUri);
                    this.setSelection(newSelectedItem);
                }
                onSnapshotDialogOk(): void {
                    this.setState({ snapshotDialogOpen: false });
                }

                onLoadClick(e: SyntheticEvent) {
                    this.setState({ loadDialogOpen: true });
                    e.preventDefault();
                    e.stopPropagation();
                }
                onSnapshotClick() {
                    this.setState({ snapshotDialogOpen: true });
                }

                getPedalboardItem(selectedId?: number): PedalboardItem | null {
                    if (selectedId === undefined) return null;

                    let pedalboard = this.model.pedalboard.get();
                    if (!pedalboard) return null;

                    if (selectedId === Pedalboard.START_CONTROL_ID) // synthetic input volume item.
                    {
                        return pedalboard.makeStartItem();
                    } else if (selectedId === Pedalboard.END_CONTROL_ID) // synthetic output volume.
                    {
                        return pedalboard.makeEndItem();
                    }

                    let it = pedalboard.itemsGenerator();
                    if (!selectedId) return null;
                    while (true) {
                        let v = it.next();
                        if (v.done) break;
                        let item = v.value;
                        if (item.instanceId === selectedId) {
                            return item;
                        }

                    }
                    return null;

                }

                handleShowModUi() {
                    let newState = !this.state.showModUi;
                    this.model.setPedalboardItemUseModUi(this.state.selectedPedal, newState);
                    let item = this.model.pedalboard.get().maybeGetItem(this.state.selectedPedal);
                    if (item) {
                        setDefaultModGuiPreference(item.uri, newState);
                    }
                }

                onPedalboardPropertyChanged(instanceId: number, key: string, value: number) {
                    this.model.setPedalboardControl(instanceId, key, value);
                }
                getSelectedPedalboardItem(): PedalboardItem | null {
                    return this.getPedalboardItem(this.state.selectedPedal);
                }
                getSelectedUri(): string {
                    let pedalboardItem = this.getSelectedPedalboardItem();
                    if (pedalboardItem === null) return "";
                    return pedalboardItem.uri;
                }
                titleBar(pedalboardItem: PedalboardItem | null, canShowModUi: boolean): React.ReactNode {
                    let uiPlugin = pedalboardItem ? this.model.getUiPlugin(pedalboardItem?.uri) : null;
                    let title = "";
                    let author = "";
                    let infoPluginUri = "";
                    let missing = false;
                    let canEditTitle = false;
                    let modGuiButtonVisible = false;
                    if (pedalboardItem) {
                        if (pedalboardItem.isEmpty()) {
                            title = "";
                        } else if (pedalboardItem.isSplit()) {
                            title = "Split";
                        } else if (pedalboardItem.isSyntheticItem()) {
                            title = pedalboardItem.pluginName ?? "#error";
                            author = "";
                            infoPluginUri = "";
                        }
                        else {
                            let uiPlugin = this.model.getUiPlugin(pedalboardItem.uri);
                            if (!uiPlugin) {
                                missing = true;
                                title = pedalboardItem?.pluginName ?? "Missing plugin";
                            } else {
                                canEditTitle = this.props.enableStructureEditing;
                                if (pedalboardItem.title !== "") {
                                    title = pedalboardItem.title;
                                    author = "";
                                } else {
                                    title = uiPlugin.name;
                                    author = uiPlugin.author_name;
                                }
                                // if (uiPlugin.description.length > 20) {
                                // }
                                infoPluginUri = uiPlugin.uri;
                                modGuiButtonVisible = true;
                            }
                        }
                    }
                    const classes = withStyles.getClasses(this.props);
                    if (missing) {
                        return (
                            <div style={{
                                flex: "1 0 auto", overflow: "hidden", marginRight: 8, minWidth: 0,
                                display: "flex", flexDirection: "row", height: 48, flexWrap: "nowrap",
                                alignItems: "center"
                            }}>
                                <div style={{ flex: "0 1 auto", minWidth: 0 }}>
                                    <span style={{ color: isDarkMode() ? "#F02020" : "#800000" }}>
                                        <span className={classes.title}>{title}</span>
                                    </span>
                                </div>
                            </div>
                        );

                    } else {
                        let pType = uiPlugin ? uiPlugin.plugin_type : PluginType.Plugin;
                        if (infoPluginUri === "http://two-play.com/plugins/toob-nam") {
                            pType = PluginType.NamPlugin;
                        }
                        let catInfo = getPluginCategoryInfo(pType, pedalboardItem?.iconColor ?? "", infoPluginUri);
                        return (
                            <div style={{
                                flex: "1 1 auto", minWidth: 0, overflow: "hidden",
                                display: "flex", flexDirection: "row", height: 48, flexWrap: "nowrap",
                                alignItems: "center", gap: 6
                            }}>
                                {uiPlugin && (
                                    <span style={{
                                        fontSize: "10px",
                                        fontWeight: 800,
                                        letterSpacing: "0.06em",
                                        padding: "2px 7px",
                                        borderRadius: 6,
                                        background: `${catInfo.color}22`,
                                        color: catInfo.color,
                                        border: `1px solid ${catInfo.color}55`,
                                        flex: "0 0 auto"
                                    }}>
                                        {catInfo.badge}
                                    </span>
                                )}
                                <div style={{ position: "relative", flex: "0 1 auto", textAlign: "left", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {canEditTitle ? (
                                        <ButtonBase
                                            style={{
                                                flex: "0 1 auto", borderRadius: "6px", width: "100%", paddingLeft: 6, paddingRight: 8, height: 42,
                                                textTransform: "none", textAlign: "left", justifyItems: "start", overflow: "clip"
                                            }}
                                            onClick={() => {
                                                this.handleEditPluginDisplayName();
                                            }}
                                        >
                                            <div style={{ flex: "0 1 auto", display: "flex", flexFlow: "row nowrap", alignItems: "center", overflow: "hidden" }}>
                                                {this.state.canDisplayPluginIcon && uiPlugin && (
                                                    <div style={{ flex: "0 0 auto", marginRight: 8 }}>
                                                        <PluginIcon
                                                            pluginType={pType}
                                                            color={getIconColor(pedalboardItem?.iconColor ?? "") || catInfo.color}
                                                            size={22}
                                                        />
                                                    </div>
                                                )}
                                                <div style={{ flex: "0 1 auto", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                                                    <span>
                                                        <span className={classes.title}>{title}</span>
                                                        {this.state.displayAuthor && (
                                                            <span className={classes.author}>{author}</span>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </ButtonBase>)
                                        : (
                                            <div style={{ flex: "0 1 auto", display: "flex", flexFlow: "row nowrap", alignItems: "center", overflow: "hidden" }}>
                                                {this.state.canDisplayPluginIcon && uiPlugin && (
                                                    <div style={{ flex: "0 0 auto", marginRight: 8 }}>
                                                        <PluginIcon
                                                            pluginType={pType}
                                                            color={getIconColor(pedalboardItem?.iconColor ?? "") || catInfo.color}
                                                            size={22}
                                                        />
                                                    </div>
                                                )}
                                                <div style={{ flex: "0 1 auto", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                                                    <span>
                                                        <span className={classes.title}>{title}</span>
                                                        {this.state.displayAuthor && (
                                                            <span className={classes.author}>{author}</span>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                        )}
                                </div>
                                <div style={{ flex: "0 0 auto", verticalAlign: "center" }}>
                                    <PluginInfoDialog plugin_uri={infoPluginUri} />
                                </div>

                                {modGuiButtonVisible && (
                                    <div style={{ flex: "0 0 auto" }}>
                                        <IconButtonEx
                                            style={{ opacity: canShowModUi ? 1.0 : 0.4 }}
                                            disabled={!canShowModUi}
                                            tooltip={(
                                                <div>
                                                    <Typography variant="body2" >
                                                        {this.state.showModUi ? "PiPedal UI" : "MOD UI"}</Typography>
                                                    <Divider />
                                                    <Typography variant="caption">Use MOD UI or PiPedal UI for plugin.
                                                        {!canShowModUi && " The current plugin does not provide a MOD user interface."}
                                                    </Typography>
                                                </div>

                                            )}
                                            onClick={() => {
                                                this.handleShowModUi()
                                            }}
                                            size="large">
                                            {(!this.state.showModUi || !canShowModUi) ?
                                                (
                                                    <ModUiIcon style={{ height: 24, width: 24, fill: this.props.theme.palette.text.primary, opacity: 0.6 }} />
                                                ) : (
                                                    <PipedalUiIcon style={{ height: 24, width: 24, fill: this.props.theme.palette.text.primary, opacity: 0.6 }} />
                                                )
                                            }
                                        </IconButtonEx>
                                    </div>

                                )}

                            </div>
                        );
                    }
                }

                snapshotIcon(theme: Theme, snapshotNumber: number) {
                    switch (snapshotNumber + 1) {
                        case 0:
                        default:
                            return (<Snapshot0Icon style={{ height: 24, width: 24, fill: theme.palette.text.primary, opacity: 0.6 }} />);
                        case 1:
                            return (<Snapshot1Icon style={{ height: 24, width: 24, fill: theme.palette.text.primary, opacity: 0.6 }} />);
                        case 2:
                            return (<Snapshot2Icon style={{ height: 24, width: 24, fill: theme.palette.text.primary, opacity: 0.6 }} />);
                        case 3:
                            return (<Snapshot3Icon style={{ height: 24, width: 24, fill: theme.palette.text.primary, opacity: 0.6 }} />);
                        case 4:
                            return (<Snapshot4Icon style={{ height: 24, width: 24, fill: theme.palette.text.primary, opacity: 0.6 }} />);
                        case 5:
                            return (<Snapshot5Icon style={{ height: 24, width: 24, fill: theme.palette.text.primary, opacity: 0.6 }} />);
                        case 6:
                            return (<Snapshot6Icon style={{ height: 24, width: 24, fill: theme.palette.text.primary, opacity: 0.6 }} />);
                    }
                }

                canShowModUi(pedalboardItem: PedalboardItem): boolean {
                    let pluginInfo = this.model.getUiPlugin(pedalboardItem.uri);
                    if (pluginInfo === null) {
                        return false;
                    }
                    return pluginInfo.modGui !== null;

                }

                render() {
                    const classes = withStyles.getClasses(this.props);
                    let pedalboard = this.model.pedalboard.get();
                    let pedalboardItem = this.getSelectedPedalboardItem();
                    let uiPlugin = null;
                    let bypassVisible = false;
                    let bypassChecked = false;
                    let canDelete = false;
                    let canInsert = false;
                    let canAppend = false;
                    let canLoad = true;
                    let instanceId = -1;
                    let missing = false;
                    let pluginUri = "#error";
                    let canShowModUi = false;
                    if (pedalboardItem) {
                        canShowModUi = this.canShowModUi(pedalboardItem);
                        canDelete = pedalboard.canDeleteItem(pedalboardItem.instanceId);
                        instanceId = pedalboardItem.instanceId;
                        pluginUri = pedalboardItem.uri;
                        if (pedalboardItem.isEmpty()) {
                            canInsert = true;
                            canAppend = true;

                        } else if (pedalboardItem.isStart()) {
                            canAppend = true;
                            canDelete = false;
                            canLoad = false;
                        } else if (pedalboardItem.isEnd()) {
                            canInsert = true;
                            canDelete = false;
                            canLoad = false;
                        } else if (pedalboardItem.isSplit()) {
                            canInsert = true;
                            canAppend = true;
                            canLoad = false;
                        } else {
                            pluginUri = pedalboardItem.uri;
                            uiPlugin = this.model.getUiPlugin(pluginUri);
                            canInsert = true;
                            canAppend = true;
                            if (uiPlugin) {
                                bypassVisible = true;
                                bypassChecked = pedalboardItem.isEnabled;
                            } else {
                                missing = true;
                            }
                        }
                    }
                    let horizontalScrollLayout = this.state.horizontalScrollLayout;
                    let selectedPluginType = uiPlugin ? uiPlugin.plugin_type : PluginType.Plugin;
                    if (pluginUri === "http://two-play.com/plugins/toob-nam") {
                        selectedPluginType = PluginType.NamPlugin;
                    }
                    let selectedCatInfo = getPluginCategoryInfo(selectedPluginType, pedalboardItem?.iconColor ?? "", pluginUri);

                    return (
                        <div className={classes.frame}>
                            <div
                                className={classes.pedalboardStageWrapper}
                                style={{
                                    flex: `0 0 ${Math.min(this.state.stageHeight, Math.max(135, this.state.screenHeight - 160))}px`,
                                    height: Math.min(this.state.stageHeight, Math.max(135, this.state.screenHeight - 160)),
                                    minHeight: 135
                                }}
                            >
                                <div id="pedalboardScroll" className={horizontalScrollLayout ? classes.pedalboardScrollSmall : classes.pedalboardScroll}>
                                    <PedalboardView key={pluginUri} selectedId={this.state.selectedPedal}
                                        enableStructureEditing={this.props.enableStructureEditing}
                                        onSelectionChanged={this.onSelectionChanged}
                                        onDoubleClick={this.onPedalDoubleClick}
                                        hasTinyToolBar={this.props.hasTinyToolBar}
                                        hardwareView={this.state.hardwareChainView}
                                        chainZoom={this.state.chainZoom}
                                        panX={this.state.panX}
                                        panY={this.state.panY}
                                        centerViewSeq={this.state.centerViewSeq}
                                        onPanChange={this.handlePanChange}
                                        onWheelZoom={this.handleWheelZoom}
                                        onLayoutSizeChanged={this.handleLayoutSizeChanged}
                                    />
                                </div>

                                {/* Dedicated Floating Controls Container — stays pinned on top when scrolling/zooming/resizing */}
                                <div style={{
                                    position: "absolute",
                                    right: 14,
                                    top: 10,
                                    bottom: 10,
                                    zIndex: 15,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    alignItems: "flex-end",
                                    gap: 6,
                                    pointerEvents: "none"
                                }}>
                                    {/* Top-Right View Toggle Switch: Icons vs Pedals/Amps */}
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: 3,
                                        borderRadius: 999,
                                        background: isDarkMode() ? "rgba(15, 20, 32, 0.92)" : "rgba(255, 255, 255, 0.94)",
                                        border: isDarkMode() ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(15, 23, 42, 0.15)",
                                        boxShadow: isDarkMode() ? "0 4px 12px rgba(0, 0, 0, 0.5)" : "0 2px 8px rgba(15, 23, 42, 0.1)",
                                        backdropFilter: "blur(8px)",
                                        pointerEvents: "auto"
                                    }}>
                                        <ButtonBase
                                            onClick={() => {
                                                window.localStorage.setItem("pipedal_hardware_chain_view", "false");
                                                this.setState({ hardwareChainView: false });
                                            }}
                                            style={{
                                                padding: "4px 10px",
                                                borderRadius: 999,
                                                fontSize: "10px",
                                                fontWeight: 800,
                                                letterSpacing: "0.06em",
                                                color: !this.state.hardwareChainView ? "#0B0E15" : (isDarkMode() ? "#94A3B8" : "#64748B"),
                                                background: !this.state.hardwareChainView ? "#00E5FF" : "transparent",
                                                boxShadow: !this.state.hardwareChainView ? "0 0 8px rgba(0, 229, 255, 0.45)" : "none",
                                                transition: "all 0.15s ease"
                                            }}
                                        >
                                            ICONS
                                        </ButtonBase>
                                        <ButtonBase
                                            onClick={() => {
                                                window.localStorage.setItem("pipedal_hardware_chain_view", "true");
                                                this.setState({ hardwareChainView: true });
                                            }}
                                            style={{
                                                padding: "4px 10px",
                                                borderRadius: 999,
                                                fontSize: "10px",
                                                fontWeight: 800,
                                                letterSpacing: "0.06em",
                                                color: this.state.hardwareChainView ? "#0B0E15" : (isDarkMode() ? "#94A3B8" : "#64748B"),
                                                background: this.state.hardwareChainView ? "#00E5FF" : "transparent",
                                                boxShadow: this.state.hardwareChainView ? "0 0 8px rgba(0, 229, 255, 0.45)" : "none",
                                                transition: "all 0.15s ease"
                                            }}
                                        >
                                            PEDALS
                                        </ButtonBase>
                                    </div>

                                    {/* Middle-Right: Center View Button ABOVE Vertical Zoom Slider */}
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 6,
                                        pointerEvents: "auto"
                                    }}>
                                        <ToolTipEx title="Center & Fit FX Chain to Maximum Visible Zoom">
                                            <ButtonBase
                                                onClick={this.handleCenterView}
                                                style={{
                                                    width: 38,
                                                    height: 38,
                                                    boxSizing: "border-box",
                                                    borderRadius: 999,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    background: isDarkMode() ? "rgba(15, 20, 32, 0.92)" : "rgba(255, 255, 255, 0.94)",
                                                    border: isDarkMode()
                                                        ? ((this.state.panX !== 0 || this.state.panY !== 0) ? "1.5px solid rgba(0, 229, 255, 0.65)" : "1px solid rgba(255, 255, 255, 0.14)")
                                                        : "1px solid rgba(15, 23, 42, 0.16)",
                                                    boxShadow: isDarkMode() ? "0 4px 12px rgba(0, 0, 0, 0.5)" : "0 2px 8px rgba(15, 23, 42, 0.1)",
                                                    color: (this.state.panX !== 0 || this.state.panY !== 0)
                                                        ? "#00E5FF"
                                                        : (isDarkMode() ? "#E2E8F0" : "#334155"),
                                                    backdropFilter: "blur(8px)"
                                                }}
                                            >
                                                <CenterFocusStrongIcon style={{ width: 20, height: 20 }} />
                                            </ButtonBase>
                                        </ToolTipEx>

                                        {/* Vertical FX Chain Zoom Slider */}
                                        <div style={{
                                            width: 38,
                                            boxSizing: "border-box",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: 5,
                                            padding: "7px 2px",
                                            borderRadius: 999,
                                            background: isDarkMode() ? "rgba(15, 20, 32, 0.92)" : "rgba(255, 255, 255, 0.94)",
                                            border: isDarkMode() ? "1px solid rgba(255, 255, 255, 0.14)" : "1px solid rgba(15, 23, 42, 0.16)",
                                            boxShadow: isDarkMode() ? "0 4px 12px rgba(0, 0, 0, 0.5)" : "0 2px 8px rgba(15, 23, 42, 0.1)",
                                            backdropFilter: "blur(8px)"
                                        }}>
                                            <ButtonBase
                                                title="Zoom In (+)"
                                                onClick={() => {
                                                    let nextZoom = Math.min(1.45, Math.round((this.state.chainZoom + 0.1) * 100) / 100);
                                                    window.localStorage.setItem("pipedal_chain_zoom", nextZoom.toString());
                                                    this.setState({ chainZoom: nextZoom });
                                                }}
                                                style={{
                                                    borderRadius: 999,
                                                    padding: 3,
                                                    color: isDarkMode() ? "#F1F5F9" : "#1E293B"
                                                }}
                                            >
                                                <ZoomInIcon style={{ width: 21, height: 21 }} />
                                            </ButtonBase>
                                            <div style={{ height: 58, display: "flex", alignItems: "center", justifyContent: "center", padding: "2px 0" }}>
                                                <Slider
                                                    orientation="vertical"
                                                    size="small"
                                                    min={0.65}
                                                    max={1.45}
                                                    step={0.05}
                                                    value={this.state.chainZoom}
                                                    onChange={(_e, val) => {
                                                        let nextZoom = typeof val === "number" ? val : val[0];
                                                        window.localStorage.setItem("pipedal_chain_zoom", nextZoom.toString());
                                                        this.setState({ chainZoom: nextZoom });
                                                    }}
                                                    sx={{
                                                        height: "100%",
                                                        padding: "0 7px",
                                                        color: "#00E5FF",
                                                        "& .MuiSlider-thumb": {
                                                            width: 13,
                                                            height: 13,
                                                        },
                                                        "& .MuiSlider-rail": {
                                                            opacity: 0.35,
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <ButtonBase
                                                title="Zoom Out (-)"
                                                onClick={() => {
                                                    let nextZoom = Math.max(0.65, Math.round((this.state.chainZoom - 0.1) * 100) / 100);
                                                    window.localStorage.setItem("pipedal_chain_zoom", nextZoom.toString());
                                                    this.setState({ chainZoom: nextZoom });
                                                }}
                                                style={{
                                                    borderRadius: 999,
                                                    padding: 3,
                                                    color: isDarkMode() ? "#F1F5F9" : "#1E293B"
                                                }}
                                            >
                                                <ZoomOutIcon style={{ width: 21, height: 21 }} />
                                            </ButtonBase>
                                            <ButtonBase
                                                title="Click to reset zoom to 100%"
                                                onClick={() => {
                                                    window.localStorage.setItem("pipedal_chain_zoom", "1");
                                                    this.setState({ chainZoom: 1.0 });
                                                }}
                                                style={{
                                                    fontSize: "9.5px",
                                                    fontWeight: 800,
                                                    lineHeight: 1.1,
                                                    paddingTop: 1,
                                                    textAlign: "center",
                                                    color: this.state.chainZoom !== 1.0 ? "#00E5FF" : (isDarkMode() ? "#CBD5E1" : "#475569")
                                                }}
                                            >
                                                {Math.round(this.state.chainZoom * 100)}%
                                            </ButtonBase>
                                        </div>
                                    </div>

                                    {this.props.enableStructureEditing && (canInsert || canAppend) ? (
                                        <ButtonBase
                                            onClick={(e) => { this.onAddClick(e); }}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 5,
                                                padding: "6px 13px",
                                                borderRadius: 999,
                                                background: isDarkMode()
                                                    ? "rgba(20, 26, 40, 0.92)"
                                                    : "rgba(255, 255, 255, 0.94)",
                                                border: isDarkMode()
                                                    ? "1px solid rgba(0, 229, 255, 0.35)"
                                                    : "1px solid rgba(2, 132, 199, 0.35)",
                                                boxShadow: isDarkMode()
                                                    ? "0 4px 14px rgba(0, 0, 0, 0.5), 0 0 10px rgba(0, 229, 255, 0.15)"
                                                    : "0 2px 8px rgba(15, 23, 42, 0.1)",
                                                color: isDarkMode() ? "#00E5FF" : "#0284C7",
                                                fontSize: "11px",
                                                fontWeight: 800,
                                                letterSpacing: "0.06em",
                                                backdropFilter: "blur(8px)",
                                                pointerEvents: "auto"
                                            }}
                                        >
                                            <AddIcon style={{ width: 16, height: 16 }} />
                                            <span>BLOCK / SPLIT</span>
                                        </ButtonBase>
                                    ) : <div />}
                                </div>
                            </div>

                            {/* Interactive Section Resize Bar Between Top FX Stage & Bottom Controls */}
                            <div
                                onPointerDown={this.onStageResizePointerDown}
                                onPointerMove={this.onStageResizePointerMove}
                                onPointerUp={this.onStageResizePointerUp}
                                onPointerCancel={this.onStageResizePointerUp}
                                title="Drag up or down to resize top & bottom sections"
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    height: 18,
                                    flex: "0 0 18px",
                                    cursor: "ns-resize",
                                    touchAction: "none",
                                    userSelect: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    zIndex: 12,
                                    background: isDarkMode() ? "rgba(15, 20, 32, 0.95)" : "rgba(241, 245, 249, 0.95)"
                                }}
                            >
                                {/* Accent horizontal line */}
                                <div style={{
                                    position: "absolute",
                                    left: 0,
                                    right: 0,
                                    top: "50%",
                                    height: this.state.isResizingStage ? 2.5 : 1.5,
                                    transform: "translateY(-50%)",
                                    background: this.state.isResizingStage
                                        ? "#00E5FF"
                                        : (bypassVisible && bypassChecked
                                            ? `linear-gradient(90deg, transparent 0%, ${selectedCatInfo.color} 50%, transparent 100%)`
                                            : (isDarkMode() ? "rgba(255, 255, 255, 0.12)" : "rgba(15, 23, 42, 0.14)")),
                                    opacity: this.state.isResizingStage ? 1 : (bypassVisible && bypassChecked ? 0.85 : 0.65)
                                }} />
                                {/* Center Resize Pill Handle Icon */}
                                <div style={{
                                    position: "relative",
                                    zIndex: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 2,
                                    padding: "2px 16px",
                                    height: 22,
                                    borderRadius: 999,
                                    background: this.state.isResizingStage
                                        ? "#00E5FF"
                                        : (isDarkMode() ? "#1E2638" : "#E2E8F0"),
                                    border: `1.5px solid ${this.state.isResizingStage ? "#00E5FF" : (isDarkMode() ? "rgba(255, 255, 255, 0.24)" : "rgba(15, 23, 42, 0.22)")}`,
                                    boxShadow: this.state.isResizingStage
                                        ? "0 0 14px rgba(0, 229, 255, 0.65)"
                                        : "0 2px 8px rgba(0, 0, 0, 0.45)",
                                    color: this.state.isResizingStage
                                        ? "#0B0E15"
                                        : (isDarkMode() ? "#E2E8F0" : "#334155"),
                                    transition: "background 0.15s ease, color 0.15s ease"
                                }}>
                                    <DragHandleIcon style={{ width: 18, height: 18 }} />
                                    <UnfoldMoreIcon style={{ width: 16, height: 16, marginLeft: -4 }} />
                                </div>
                            </div>
                            <div className={classes.controlToolBar}>
                                <div style={{
                                    display: "flex", flexFlow: "row nowrap", alignItems: "center", justifyContent: "center", minWidth: 0,
                                    width: "100%", maxWidth: 1280, marginLeft: "auto", marginRight: "auto", height: 54, paddingLeft: 16, paddingRight: 16
                                }} >
                                    <div style={{ flex: "0 0 auto", marginRight: 8 }} >
                                        <div style={{ display: bypassVisible ? "flex" : "none", alignItems: "center" }} >
                                            <ToolTipEx title={bypassChecked ? "Effect Active (Click to Bypass)" : "Effect Bypassed (Click to Enable)"}
                                            >
                                                <ButtonBase
                                                    onClick={() => {
                                                        if (pedalboardItem != null) {
                                                            this.model.setPedalboardItemEnabled(pedalboardItem.getInstanceId(), !bypassChecked);
                                                        }
                                                    }}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 7,
                                                        padding: "5px 12px",
                                                        borderRadius: 999,
                                                        background: bypassChecked
                                                            ? `${selectedCatInfo.color}22`
                                                            : (isDarkMode() ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.06)"),
                                                        border: `1.5px solid ${bypassChecked ? selectedCatInfo.color : (isDarkMode() ? "rgba(255,255,255,0.15)" : "rgba(15,23,42,0.2)")}`,
                                                        boxShadow: bypassChecked ? `0 0 12px ${selectedCatInfo.glow}` : "none",
                                                        transition: "all 0.15s ease"
                                                    }}
                                                >
                                                    <span style={{
                                                        width: 9,
                                                        height: 9,
                                                        borderRadius: "50%",
                                                        background: bypassChecked ? selectedCatInfo.color : "#64748B",
                                                        boxShadow: bypassChecked ? `0 0 8px ${selectedCatInfo.color}` : "none"
                                                    }} />
                                                    <span style={{
                                                        fontSize: "11px",
                                                        fontWeight: 800,
                                                        letterSpacing: "0.06em",
                                                        color: bypassChecked
                                                            ? (isDarkMode() ? "#F8FAFC" : "#0F172A")
                                                            : "#94A3B8"
                                                    }}>
                                                        {bypassChecked ? "ON" : "BYPASS"}
                                                    </span>
                                                </ButtonBase>
                                            </ToolTipEx>
                                        </div>
                                    </div>
                                    {
                                        (!this.state.splitControlBar || !this.props.enableStructureEditing)
                                        && this.titleBar(pedalboardItem, canShowModUi)
                                    }
                                    <div style={{ flex: "1 1 1px" }}>

                                    </div>
                                    {this.props.enableStructureEditing && (
                                        <div style={{ flex: "0 0 auto", display: "flex", flexFlow: "row nowrap", alignItems: "center", gap: 4 }}>
                                            <div style={{ flex: "0 0 auto" }}>
                                                <PluginPresetSelector pedalboardItem={pedalboardItem} instanceId={pedalboardItem?.instanceId ?? 0}
                                                />
                                            </div>

                                            <Menu
                                                id="add-menu"
                                                anchorEl={this.state.addMenuAnchorEl}
                                                keepMounted
                                                open={Boolean(this.state.addMenuAnchorEl)}
                                                onClose={() => this.handleAddClose()}
                                                TransitionComponent={Fade}
                                            >
                                                {canInsert && (<MenuItem onClick={() => this.onInsertPedal(instanceId)}>Insert pedal</MenuItem>)}
                                                {canAppend && (<MenuItem onClick={() => this.onAppendPedal(instanceId)}>Append pedal</MenuItem>)}
                                                <Divider />
                                                {canInsert && (<MenuItem onClick={() => this.onInsertSplit(instanceId)}>Insert split</MenuItem>)}
                                                {canAppend && (<MenuItem onClick={() => this.onAppendSplit(instanceId)}>Append split</MenuItem>)}
                                            </Menu>
                                            <div style={{ flex: "0 0 auto", display: canDelete ? "block" : "none" }}>
                                                <IconButtonEx tooltip="Remove block from chain"
                                                    onClick={() => { this.onDeletePedal(pedalboardItem?.instanceId ?? -1) }}
                                                    size="large">
                                                    <OldDeleteIcon style={{ height: 22, width: 22, fill: this.props.theme.palette.text.primary, opacity: 0.7 }} />
                                                </IconButtonEx>
                                            </div>
                                            <div style={{ flex: "0 0 auto", marginLeft: 4, marginRight: 4 }}>
                                                <ButtonEx
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    tooltip="Select Effect / Amp / NAM Plugin"
                                                    onClick={this.onLoadClick}
                                                    disabled={this.state.selectedPedal === -1 || (!canLoad) || (this.getSelectedPedalboardItem()?.isSplit() ?? true)}
                                                    startIcon={<InputIcon style={{ width: 16, height: 16 }} />}
                                                    style={{
                                                        textTransform: "none",
                                                        fontWeight: 700,
                                                        fontSize: "12px",
                                                        letterSpacing: "0.02em",
                                                        borderRadius: 999,
                                                        padding: "5px 14px",
                                                        background: isDarkMode()
                                                            ? `linear-gradient(135deg, ${selectedCatInfo.color}CC 0%, #2563EB 100%)`
                                                            : undefined,
                                                        color: "#FFFFFF",
                                                        boxShadow: isDarkMode() ? `0 2px 10px ${selectedCatInfo.glow}` : undefined
                                                    }}
                                                >
                                                    {pedalboardItem?.isEmpty() ? "Select FX" : "Change FX"}
                                                </ButtonEx>
                                            </div>
                                            <div style={{ flex: "0 0 auto" }}>
                                                <IconButtonEx tooltip="MIDI bindings"
                                                    onClick={(e) => { this.handleMidiConfiguration(instanceId); }}
                                                    size="large">
                                                    <MidiIcon style={{ height: 22, width: 22, fill: this.props.theme.palette.text.primary, opacity: 0.7 }} />
                                                </IconButtonEx>
                                            </div>
                                            {!this.state.splitControlBar ? (
                                                <div style={{
                                                    flex: "0 0 auto",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 3,
                                                    padding: "3px 6px",
                                                    borderRadius: 999,
                                                    background: isDarkMode() ? "rgba(11, 14, 21, 0.75)" : "rgba(15, 23, 42, 0.06)",
                                                    border: isDarkMode() ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(15, 23, 42, 0.12)",
                                                    marginLeft: 4
                                                }}>
                                                    <span style={{
                                                        fontSize: "9.5px",
                                                        fontWeight: 800,
                                                        letterSpacing: "0.06em",
                                                        color: isDarkMode() ? "#64748B" : "#475569",
                                                        paddingLeft: 4,
                                                        paddingRight: 3
                                                    }}>
                                                        SCENES
                                                    </span>
                                                    {[0, 1, 2, 3, 4, 5].map((sceneIdx) => {
                                                        const sceneSnap = pedalboard.snapshots && sceneIdx < pedalboard.snapshots.length
                                                            ? pedalboard.snapshots[sceneIdx]
                                                            : null;
                                                        const isSceneSelected = this.state.selectedSnapshot === sceneIdx;
                                                        const hasSceneData = sceneSnap !== null;
                                                        const sceneName = sceneSnap?.name ? `Scene ${sceneIdx + 1}: ${sceneSnap.name}` : (hasSceneData ? `Scene ${sceneIdx + 1}` : `Scene ${sceneIdx + 1} (Empty - click to configure)`);
                                                        return (
                                                            <ToolTipEx key={sceneIdx} title={sceneName}>
                                                                <ButtonBase
                                                                    onClick={() => {
                                                                        if (hasSceneData) {
                                                                            this.model.selectSnapshot(sceneIdx);
                                                                        } else {
                                                                            this.setState({ snapshotDialogOpen: true });
                                                                        }
                                                                    }}
                                                                    style={{
                                                                        width: 24,
                                                                        height: 24,
                                                                        borderRadius: 999,
                                                                        fontSize: "11px",
                                                                        fontWeight: 800,
                                                                        position: "relative",
                                                                        color: isSceneSelected
                                                                            ? "#0B0E15"
                                                                            : (hasSceneData ? (isDarkMode() ? "#E2E8F0" : "#0F172A") : "#64748B"),
                                                                        background: isSceneSelected
                                                                            ? "#00E5FF"
                                                                            : (hasSceneData ? (isDarkMode() ? "rgba(255,255,255,0.09)" : "rgba(15,23,42,0.09)") : "transparent"),
                                                                        boxShadow: isSceneSelected ? "0 0 10px rgba(0, 229, 255, 0.55)" : "none",
                                                                        transition: "all 0.12s ease"
                                                                    }}
                                                                >
                                                                    {sceneIdx + 1}
                                                                    {hasSceneData && !isSceneSelected && (
                                                                        <span style={{
                                                                            position: "absolute",
                                                                            bottom: 2,
                                                                            width: 3.5,
                                                                            height: 3.5,
                                                                            borderRadius: "50%",
                                                                            background: "#00E5FF"
                                                                        }} />
                                                                    )}
                                                                </ButtonBase>
                                                            </ToolTipEx>
                                                        );
                                                    })}
                                                    <div style={{
                                                        width: 1,
                                                        height: 14,
                                                        background: isDarkMode() ? "rgba(255, 255, 255, 0.12)" : "rgba(15, 23, 42, 0.14)",
                                                        marginLeft: 2,
                                                        marginRight: 1
                                                    }} />
                                                    <ToolTipEx title="Configure Scenes / Snapshots (1–6)">
                                                        <ButtonBase
                                                            onClick={() => { this.setState({ snapshotDialogOpen: true }); }}
                                                            style={{
                                                                width: 24,
                                                                height: 24,
                                                                borderRadius: 999,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                color: isDarkMode() ? "#94A3B8" : "#475569"
                                                            }}
                                                        >
                                                            <SettingsIcon style={{ width: 15, height: 15 }} />
                                                        </ButtonBase>
                                                    </ToolTipEx>
                                                </div>
                                            ) : (
                                                <div style={{ flex: "0 0 auto" }}>
                                                    <IconButtonEx tooltip="Configure Scenes / Snapshots (1–6)"
                                                        onClick={() => { this.setState({ snapshotDialogOpen: true }); }}
                                                        size="large">
                                                        <SettingsIcon style={{ height: 20, width: 20, opacity: 0.75 }} />
                                                    </IconButtonEx>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {
                                this.state.splitControlBar && this.props.enableStructureEditing && (
                                    <div className={classes.splitControlBar}>
                                        {
                                            this.titleBar(pedalboardItem, canShowModUi)
                                        }
                                    </div>
                                )
                            }
                            <div id="mainPageControls" className={horizontalScrollLayout ? classes.controlContentSmall : classes.controlContent}>
                                {
                                    missing ? (
                                        <div style={{ marginLeft: 40, marginTop: 20 }}>
                                            <Typography variant="body1" paragraph={true}>Error: Plugin is not installed.</Typography>
                                            <Typography variant="body2" paragraph={true}>{pluginUri}</Typography>
                                        </div>

                                    ) :
                                        (
                                            GetControlView(pedalboardItem, this.state.showModUi && canShowModUi,
                                                (instanceId: number, showModGui: boolean) => {
                                                    this.model.setPedalboardItemUseModUi(instanceId, showModGui)
                                                    this.setState({ showModUi: showModGui });
                                                }
                                            )
                                        )
                                }
                            </div>
                            <MidiBindingsDialog open={this.state.showMidiBindingsDialog}
                                onClose={() => this.setState({ showMidiBindingsDialog: false })}
                            />
                            {
                                (this.state.loadDialogOpen) && (
                                    <LoadPluginDialog open={this.state.loadDialogOpen} uri={this.getSelectedUri()}
                                        onOk={this.onLoadOk} onCancel={this.onLoadCancel}
                                    />

                                )
                            }
                            {(this.state.snapshotDialogOpen) && (
                                <SnapshotDialog open={this.state.snapshotDialogOpen} onOk={() => this.onSnapshotDialogOk()} />
                            )}
                            {(this.state.displayNameDialogOpen) && (
                                <PluginNameDialog open={this.state.displayNameDialogOpen}
                                    pedalboardItem={pedalboardItem}
                                    allowEmpty={true}
                                    onClose={() => this.setState({ displayNameDialogOpen: false })}
                                    onApply={(newName: string, color: string) => {
                                        if (pedalboardItem) {
                                            this.model.setPedalboardItemTitle(pedalboardItem.instanceId, newName, color);
                                        }
                                    }}
                                />
                            )}
                        </div>
                    );
                }
            },
            styles
        ));

export default MainPage