/* eslint-disable @typescript-eslint/no-unused-vars */
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

import { Theme } from '@mui/material/styles';
import WithStyles from './WithStyles';
import {createStyles} from './WithStyles';

import { withStyles } from "tss-react/mui";
import { PluginType } from './Lv2Plugin';


import FxSimulatorIcon from './svg/fx_simulator.svg?react';
import FxPhaserIcon from './svg/fx_phaser.svg?react';
import FxFilterIcon from './svg/fx_filter.svg?react';
import FxDelayIcon from './svg/fx_delay.svg?react';

import FxNamIcon from './svg/fx_nam.svg?react';
import FxAmplifierIcon from './svg/fx_amplifier.svg?react';
import FxChorusIcon from './svg/fx_chorus.svg?react';
import FxModulatorIcon from './svg/fx_modulator.svg?react';
import FxReverbIcon from './svg/fx_reverb.svg?react';
import FxDistortionIcon from './svg/fx_distortion.svg?react';
import FxFlangerIcon from './svg/fx_flanger.svg?react';
import FxFilterHpIcon from './svg/fx_filter_hp.svg?react';
import FxParametricEqIcon from './svg/fx_parametric_eq.svg?react';
import FxMultibandEqIcon from './svg/fx_multiband_eq.svg?react';
import FxEqIcon from './svg/fx_eq.svg?react';
import FxUtilityIcon from './svg/fx_utility.svg?react';
import FxCompressorIcon from './svg/fx_compressor.svg?react';
import FxLimiterIcon from './svg/fx_limiter.svg?react';
import FxConstantIcon from './svg/fx_constant.svg?react';
import FxFunctionIcon from './svg/fx_function.svg?react';
import FxGateIcon from './svg/fx_gate.svg?react';
import FxConverterIcon from './svg/fx_converter.svg?react';
import FxGeneratorIcon from './svg/fx_generator.svg?react';
import FxOscillatorIcon from './svg/fx_oscillator.svg?react';
import FxInstrumentIcon from './svg/fx_instrument.svg?react';
import FxMixerIcon from './svg/fx_mixer.svg?react';
import FxPitchIcon from './svg/fx_pitch.svg?react';
import FxSpatialIcon from './svg/fx_spatial.svg?react';
import FxSpectralIcon from './svg/fx_spectral.svg?react';
import FxAnalyzerIcon from './svg/fx_analyzer.svg?react';
import FxPluginIcon from './svg/fx_plugin.svg?react';
import SplitAIcon from './svg/fx_split_a.svg?react';
import SplitBIcon from './svg/fx_split_b.svg?react';
import SplitMixIcon from './svg/fx_dial.svg?react';
import SplitLrIcon from './svg/fx_lr.svg?react';
import FxEmptyIcon from './svg/fx_empty.svg?react';

import FxTerminalIcon from './svg/fx_terminal.svg?react';

import { isDarkMode } from './DarkMode';
import { PiPedalModel } from './PiPedalModel';

export interface IconColorSelect {
    key: string, 
    value: string | undefined,
};

export const getIconColorSelections = (darkMode?: boolean): IconColorSelect[] => {
    if (darkMode === undefined) darkMode = isDarkMode();
    let result: IconColorSelect[] = [];

    let l: number;
    let c: number;
    if (darkMode) {
        l = 0.8
        c = 0.25;
    } else {
        l = 0.5;
        c = 0.20;
    }

    for (let angle = 0; angle < 360; angle += 22.5) {
        if (angle === 270-22.5) 
        {
            // for some reason, this one is useless. Patch in a more useful light blue. :-/
            let a2 = 270;
            let l2: number;
            let c2: number;
            if (darkMode) {
                l2 = 0.9
                c2 = 0.25;
            } else {
                l2 = 0.7;
                c2 = 0.20;
            }
            result.push(
                {
                    key: "oklch" + Math.round(angle*10).toString(), 
                    value: ("oklch("  + l2.toString() + " " + c2.toString() + " " + (a2).toString() + ")")

                }
            );

        } else  if (angle === 270-45) 
        {
            // for some reason, this one is useless. Patch in a more useful light blue. :-/
            let a2 = 180;
            let l2: number;
            let c2: number;
            if (darkMode) {
                l2 = 0.95
                c2 = 0.25;
            } else {
                l2 = 0.75;
                c2 = 0.20;
            }
            result.push(
                {
                    key: "oklch" + Math.round(angle*10).toString(), 
                    value: ("oklch("  + l2.toString() + " " + c2.toString() + " " + (a2).toString() + ")")

                }
            );

        } else   {
            result.push(
                {
                    key: "oklch" + Math.round(angle*10).toString(), 
                    value: ("oklch("  + l.toString() + " " + c.toString() + " " + (angle).toString() + ")")

                }
            );
        }
    }
    return result;

};


function makeDefaultColorMap(): {[key:string]: string} {
    let result: {[key:string]: string} = {};
    for (let selection  of getIconColorSelections())
    {
        result[selection.key] = selection.value??"";
    }
    return result;
}
    
const iconColors: {[key:string]: string} = makeDefaultColorMap();

export const getIconColor = (key?: string): string| undefined => {
    if (iconColors.hasOwnProperty(key!))
    {
        return iconColors[key!];
    }
    return undefined;
}

export interface PluginCategoryInfo {
    badge: string;
    color: string;
    glow: string;
}

export function getPluginCategoryInfo(pluginType: PluginType, customIconColor?: string, pluginUri?: string): PluginCategoryInfo {
    let customColor = getIconColor(customIconColor);
    if (pluginUri === "http://two-play.com/plugins/toob-nam" || pluginType === PluginType.NamPlugin) {
        let c = customColor || "#FF3864";
        return { badge: "NAM", color: c, glow: "rgba(255, 56, 100, 0.35)" };
    }
    switch (pluginType) {
        case PluginType.AmplifierPlugin: {
            let c = customColor || "#FF5E36";
            return { badge: "AMP", color: c, glow: "rgba(255, 94, 54, 0.35)" };
        }
        case PluginType.DistortionPlugin:
        case PluginType.WaveshaperPlugin:
        case PluginType.FunctionPlugin: {
            let c = customColor || "#FF9F1C";
            return { badge: "DRV", color: c, glow: "rgba(255, 159, 28, 0.35)" };
        }
        case PluginType.SimulatorPlugin: {
            let c = customColor || "#00D2B8";
            return { badge: "CAB / IR", color: c, glow: "rgba(0, 210, 184, 0.35)" };
        }
        case PluginType.CompressorPlugin:
        case PluginType.DynamicsPlugin:
        case PluginType.ExpanderPlugin:
        case PluginType.LimiterPlugin:
        case PluginType.GatePlugin: {
            let c = customColor || "#FFD166";
            return { badge: "DYN", color: c, glow: "rgba(255, 209, 102, 0.35)" };
        }
        case PluginType.EQPlugin:
        case PluginType.ParaEQPlugin:
        case PluginType.MultiEQPlugin:
        case PluginType.FilterPlugin:
        case PluginType.BandpassPlugin:
        case PluginType.AllpassPlugin:
        case PluginType.LowpassPlugin:
        case PluginType.HighpassPlugin: {
            let c = customColor || "#38BDF8";
            return { badge: "EQ", color: c, glow: "rgba(56, 189, 248, 0.35)" };
        }
        case PluginType.ChorusPlugin:
        case PluginType.ModulatorPlugin:
        case PluginType.CombPlugin:
        case PluginType.PhaserPlugin:
        case PluginType.FlangerPlugin: {
            let c = customColor || "#A855F7";
            return { badge: "MOD", color: c, glow: "rgba(168, 85, 247, 0.35)" };
        }
        case PluginType.DelayPlugin: {
            let c = customColor || "#10B981";
            return { badge: "DLY", color: c, glow: "rgba(16, 185, 129, 0.35)" };
        }
        case PluginType.ReverbPlugin:
        case PluginType.SpatialPlugin: {
            let c = customColor || "#EC4899";
            return { badge: "REV", color: c, glow: "rgba(236, 72, 153, 0.35)" };
        }
        case PluginType.PitchPlugin:
        case PluginType.SpectralPlugin: {
            let c = customColor || "#6366F1";
            return { badge: "PITCH", color: c, glow: "rgba(99, 102, 241, 0.35)" };
        }
        case PluginType.SplitA:
            return { badge: "SPLIT A", color: "#38BDF8", glow: "rgba(56, 189, 248, 0.35)" };
        case PluginType.SplitB:
            return { badge: "SPLIT B", color: "#A855F7", glow: "rgba(168, 85, 247, 0.35)" };
        case PluginType.SplitMix:
            return { badge: "MIX", color: "#10B981", glow: "rgba(16, 185, 129, 0.35)" };
        case PluginType.SplitLR:
            return { badge: "L / R", color: "#F59E0B", glow: "rgba(245, 158, 11, 0.35)" };
        case PluginType.Terminal:
            return { badge: "I/O", color: "#00E5FF", glow: "rgba(0, 229, 255, 0.35)" };
        case PluginType.None:
            return { badge: "EMPTY", color: "#64748B", glow: "rgba(100, 116, 139, 0.25)" };
        default: {
            let c = customColor || "#8B5CF6";
            return { badge: "FX", color: c, glow: "rgba(139, 92, 246, 0.35)" };
        }
    }
}

export function renderHardwareIllustration(
    badge: string,
    color: string,
    enabled: boolean
): React.ReactElement {
    const activeColor = enabled ? color : "#64748B";
    const bodyFill = enabled ? `${color}24` : "rgba(30, 41, 59, 0.45)";
    const strokeCol = enabled ? color : "#475569";

    if (badge === "NAM") {
        // Neural Amp Modeler / Profiler Head Illustration
        return (
            <svg width={70} height={44} viewBox="0 0 58 36" style={{ overflow: "visible" }}>
                {/* Top Handle */}
                <path d="M 21 3 L 37 3" stroke={strokeCol} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
                {/* Amp Profiler Chassis */}
                <rect x={3} y={4} width={52} height={29} rx={4.5} fill="#0F1420" stroke={strokeCol} strokeWidth={1.6} />
                <rect x={5.5} y={6.5} width={47} height={14} rx={2.5} fill={bodyFill} stroke={strokeCol} strokeWidth={0.9} opacity={0.9} />
                {/* Glowing Neural Capture Wave inside Screen */}
                <path
                    d="M 10 13.5 Q 15 7, 20 13.5 T 30 13.5 T 40 13.5 T 48 13.5"
                    fill="none"
                    stroke={activeColor}
                    strokeWidth={1.6}
                    strokeLinecap="round"
                />
                {/* 4 Front Panel Knobs + Capture LED */}
                {[12, 21, 30, 39].map((cx, i) => (
                    <g key={i}>
                        <circle cx={cx} cy={26.5} r={3} fill="#1E293B" stroke={strokeCol} strokeWidth={1.1} />
                        <line x1={cx} y1={26.5} x2={cx + 1.2} y2={24.3} stroke={activeColor} strokeWidth={1.1} strokeLinecap="round" />
                    </g>
                ))}
                <circle cx={47.5} cy={26.5} r={2.2} fill={enabled ? activeColor : "#334155"} />
            </svg>
        );
    }

    if (badge === "AMP") {
        // Classic Tube Amplifier Head Illustration
        return (
            <svg width={70} height={44} viewBox="0 0 58 36" style={{ overflow: "visible" }}>
                {/* Top Carry Handle */}
                <path d="M 20 2.5 L 38 2.5" stroke={strokeCol} strokeWidth={2} strokeLinecap="round" opacity={0.75} />
                {/* Outer Tolex Shell */}
                <rect x={2} y={4} width={54} height={29} rx={4} fill="#111622" stroke={strokeCol} strokeWidth={1.6} />
                {/* Woven Grill Cloth Area */}
                <rect x={5} y={6.5} width={48} height={14} rx={2} fill={bodyFill} stroke={strokeCol} strokeWidth={0.9} />
                <line x1={5} y1={11} x2={53} y2={11} stroke={strokeCol} strokeWidth={0.6} strokeDasharray="2 2" opacity={0.5} />
                <line x1={5} y1={15.5} x2={53} y2={15.5} stroke={strokeCol} strokeWidth={0.6} strokeDasharray="2 2" opacity={0.5} />
                {/* Amp Logo Plate */}
                <rect x={22} y={10.5} width={14} height={4.5} rx={1.5} fill="#0F1420" stroke={activeColor} strokeWidth={1} />
                {/* Lower Control Faceplate & 5 Knobs */}
                <rect x={5} y={22.5} width={48} height={7.5} rx={1.5} fill="#1A2234" />
                {[10, 18, 26, 34, 42].map((cx, i) => (
                    <circle key={i} cx={cx} cy={26.2} r={2.3} fill="#0F1420" stroke={activeColor} strokeWidth={1.1} />
                ))}
                {/* Pilot Light */}
                <circle cx={49} cy={26.2} r={2} fill={enabled ? "#FF3864" : "#334155"} />
            </svg>
        );
    }

    if (badge === "CAB / IR") {
        // 4x12 Speaker Cabinet Illustration
        return (
            <svg width={56} height={44} viewBox="0 0 46 36" style={{ overflow: "visible" }}>
                <rect x={5} y={2} width={36} height={32} rx={4} fill="#101520" stroke={strokeCol} strokeWidth={1.6} />
                <rect x={8} y={5} width={30} height={26} rx={2.5} fill={bodyFill} stroke={strokeCol} strokeWidth={0.8} />
                {/* 4x12 Speaker Cones */}
                {[
                    [16.5, 11.5],
                    [29.5, 11.5],
                    [16.5, 24.5],
                    [29.5, 24.5],
                ].map(([cx, cy], i) => (
                    <g key={i}>
                        <circle cx={cx} cy={cy} r={5.2} fill="#0B0E17" stroke={strokeCol} strokeWidth={1.1} />
                        <circle cx={cx} cy={cy} r={1.8} fill={activeColor} opacity={0.85} />
                    </g>
                ))}
            </svg>
        );
    }

    if (badge === "EQ") {
        // Graphic / Parametric EQ Pedal with Sliders
        return (
            <svg width={58} height={44} viewBox="0 0 48 36" style={{ overflow: "visible" }}>
                {/* Side Jacks */}
                <rect x={3} y={13} width={2.5} height={6} rx={1} fill="#64748B" />
                <rect x={42.5} y={13} width={2.5} height={6} rx={1} fill="#64748B" />
                {/* Pedal Enclosure */}
                <rect x={5.5} y={2} width={37} height={32} rx={4.5} fill="#111622" stroke={strokeCol} strokeWidth={1.6} />
                <rect x={8.5} y={5} width={31} height={17} rx={2} fill={bodyFill} />
                {/* 5 EQ Fader Sliders */}
                {[
                    [13, 14],
                    [18.5, 9.5],
                    [24, 12],
                    [29.5, 8.5],
                    [35, 13.5],
                ].map(([x, capY], i) => (
                    <g key={i}>
                        <line x1={x} y1={7} x2={x} y2={19.5} stroke="#475569" strokeWidth={1.3} strokeLinecap="round" />
                        <rect x={x - 2} y={capY} width={4} height={2.6} rx={1} fill={activeColor} />
                    </g>
                ))}
                {/* Bottom Footswitch Pad */}
                <rect x={9} y={24.5} width={30} height={6.5} rx={2} fill="#1E293B" stroke={strokeCol} strokeWidth={1} />
            </svg>
        );
    }

    // Default Stompbox Pedal Illustration (DRV, MOD, DLY, REV, DYN, PITCH, FX)
    return (
        <svg width={54} height={44} viewBox="0 0 44 36" style={{ overflow: "visible" }}>
            {/* Side Input/Output Jacks */}
            <rect x={3.5} y={13} width={2.5} height={6} rx={1} fill="#64748B" />
            <rect x={38} y={13} width={2.5} height={6} rx={1} fill="#64748B" />
            {/* Stompbox Metal Body */}
            <rect x={6} y={2} width={32} height={32} rx={4.5} fill="#121724" stroke={strokeCol} strokeWidth={1.6} />
            {/* Upper Knob Faceplate */}
            <rect x={8.5} y={4.5} width={27} height={14.5} rx={2.5} fill={bodyFill} />
            {/* 3 Stompbox Knobs */}
            {[13.5, 22, 30.5].map((cx, i) => (
                <g key={i}>
                    <circle cx={cx} cy={10.5} r={3.1} fill="#0F1420" stroke={strokeCol} strokeWidth={1.1} />
                    <line x1={cx} y1={10.5} x2={cx + (i - 1) * 1.3} y2={8.2} stroke={activeColor} strokeWidth={1.1} strokeLinecap="round" />
                </g>
            ))}
            {/* Stompbox Center Status LED */}
            <circle cx={22} cy={16.5} r={1.5} fill={enabled ? activeColor : "#334155"} />
            {/* Bottom Footswitch Pad / Stomp Actuator */}
            <rect x={9} y={21.5} width={26} height={9.5} rx={2.5} fill="#1E293B" stroke={strokeCol} strokeWidth={1} />
            <circle cx={22} cy={26.2} r={2.6} fill="#94A3B8" stroke="#0F172A" strokeWidth={1} />
        </svg>
    );
}




const styles = (theme: Theme) =>
    createStyles({
        icon: {
            width: "24px",
            height: "24px",
            margin: "0px",
            opacity: "0.6",
            color: theme.palette.text.primary,
            fill: theme.palette.text.primary
        },

    });

export interface PluginIconProps extends WithStyles<typeof styles> {
    size?: number;
    opacity?: number;
    color?: string;
    offsetY?: number;
    pluginType: PluginType;
    pluginMissing?: boolean;
}

export function SelectSvgIcon(plugin_type: PluginType, className: string, size: number = 24, opacity: number = 1.0, missingPlugin: boolean = false, color = "") {
    if (missingPlugin) {
        color = isDarkMode() ? "#C00000" : "#B00000";
    }
    let myStyle = { width: size, height: size, opacity: opacity, color: color, fill: color };
    switch (plugin_type) {

        case PluginType.NamPlugin:
            return <FxNamIcon className={className} style={myStyle} />;
        case PluginType.PhaserPlugin:
            return <FxPhaserIcon className={className} style={myStyle} />;
        case PluginType.FilterPlugin:
        case PluginType.BandpassPlugin:
        case PluginType.AllpassPlugin:
            return <FxFilterIcon className={className} style={myStyle} />;
        case PluginType.DelayPlugin:
            return <FxDelayIcon className={className} style={myStyle} />;
        case PluginType.SimulatorPlugin:
            return <FxSimulatorIcon className={className} style={myStyle} />;
        case PluginType.AmplifierPlugin:
            return <FxAmplifierIcon className={className} style={myStyle} />;
        case PluginType.ChorusPlugin:
            return <FxChorusIcon className={className} style={myStyle} />;
        case PluginType.ModulatorPlugin:
        case PluginType.CombPlugin:
            return <FxModulatorIcon className={className} style={myStyle} />;
        case PluginType.ReverbPlugin:
            return <FxReverbIcon className={className} style={myStyle} />;
        case PluginType.DistortionPlugin:
            return <FxDistortionIcon className={className} style={myStyle} />;
        case PluginType.FlangerPlugin:
            return <FxFlangerIcon className={className} style={myStyle} />;
        case PluginType.LowpassPlugin:
            return <FxFilterIcon className={className} style={myStyle} />;
        case PluginType.HighpassPlugin:
            return <FxFilterHpIcon className={className} style={myStyle} />;
        case PluginType.ParaEQPlugin:
            return <FxParametricEqIcon className={className} style={myStyle} />;
        case PluginType.MultiEQPlugin:
            return <FxMultibandEqIcon className={className} style={myStyle} />;
        case PluginType.EQPlugin:
            return <FxEqIcon className={className} style={myStyle} />;
        case PluginType.UtilityPlugin:
            return <FxUtilityIcon className={className} style={myStyle} />;
        case PluginType.CompressorPlugin:
        case PluginType.DynamicsPlugin:
        case PluginType.ExpanderPlugin:
            return <FxCompressorIcon className={className} style={myStyle} />;

        case PluginType.LimiterPlugin:
            return <FxLimiterIcon className={className} style={myStyle} />;
        case PluginType.ConstantPlugin:
            return <FxConstantIcon className={className} style={myStyle} />;
        case PluginType.FunctionPlugin:
        case PluginType.WaveshaperPlugin:
            return <FxFunctionIcon className={className} style={myStyle} />;
        case PluginType.GatePlugin:
            return <FxGateIcon className={className} style={myStyle} />;
        case PluginType.ConverterPlugin:
            return <FxConverterIcon className={className} style={myStyle} />;
        case PluginType.GeneratorPlugin:
            return <FxGeneratorIcon className={className} style={myStyle} />;
        case PluginType.OscillatorPlugin:
            return <FxOscillatorIcon className={className} style={myStyle} />;
        case PluginType.InstrumentPlugin:
            return <FxInstrumentIcon className={className} style={myStyle} />;
        case PluginType.MixerPlugin:
            return <FxMixerIcon className={className} style={myStyle} />;
        case PluginType.PitchPlugin:
            return <FxPitchIcon className={className} style={myStyle} />;
        case PluginType.SpatialPlugin:
            return <FxSpatialIcon className={className} style={myStyle} />;
        case PluginType.SpectralPlugin:
            return <FxSpectralIcon className={className} style={myStyle} />;
        case PluginType.AnalyserPlugin:
            return <FxAnalyzerIcon className={className} style={myStyle} />;
        case PluginType.SplitA:
            return <SplitAIcon className={className} style={myStyle} />;
        case PluginType.SplitB:
            return <SplitBIcon className={className} style={myStyle} />;
        case PluginType.SplitMix:
            return <SplitMixIcon className={className} style={myStyle} />;
        case PluginType.SplitLR:
            return <SplitLrIcon className={className} style={myStyle} />;

        case PluginType.None:
            return <FxEmptyIcon className={className} style={myStyle} />;
        case PluginType.Terminal:
            return <FxTerminalIcon className={className} style={myStyle} />;

        case PluginType.Plugin:
        default:
            return <FxPluginIcon className={className} style={myStyle} />;
    }
}
export function SelectBaseIcon(plugin_type: PluginType): string {
    switch (plugin_type) {
        case PluginType.NamPlugin:
            return "fx_nam.svg";
        case PluginType.PhaserPlugin:
            return "fx_phaser.svg";
        case PluginType.FilterPlugin:
        case PluginType.BandpassPlugin:
        case PluginType.AllpassPlugin:
            return "fx_filter.svg";
        case PluginType.DelayPlugin:
            return "fx_delay.svg";
        case PluginType.SimulatorPlugin:
            return "fx_simulator.svg";
        case PluginType.AmplifierPlugin:
            return "fx_amplifier.svg";
        case PluginType.ChorusPlugin:
            return "fx_chorus.svg";
        case PluginType.ModulatorPlugin:
        case PluginType.CombPlugin:
            return "fx_modulator.svg";
        case PluginType.ReverbPlugin:
            return "fx_reverb.svg";
        case PluginType.DistortionPlugin:
            return "fx_distortion.svg";
        case PluginType.FlangerPlugin:
            return "fx_flanger.svg";
        case PluginType.LowpassPlugin:
            return "fx_filter.svg";
        case PluginType.HighpassPlugin:
            return "fx_filter_hp.svg";
        case PluginType.ParaEQPlugin:
            return "fx_parametric_eq.svg";
        case PluginType.MultiEQPlugin:
            return "fx_multiband_eq.svg";
        case PluginType.EQPlugin:
            return "fx_eq.svg";
        case PluginType.UtilityPlugin:
            return "fx_utility.svg";
        case PluginType.CompressorPlugin:
        case PluginType.DynamicsPlugin:
        case PluginType.ExpanderPlugin:
            return "fx_compressor.svg";
        case PluginType.LimiterPlugin:
            return "fx_limiter.svg";
        case PluginType.ConstantPlugin:
            return "fx_constant.svg";
        case PluginType.FunctionPlugin:
        case PluginType.WaveshaperPlugin:
            return "fx_function.svg";
        case PluginType.GatePlugin:
            return "fx_gate.svg";
        case PluginType.ConverterPlugin:
            return "fx_converter.svg";
        case PluginType.GeneratorPlugin:
            return "fx_generator.svg";
        case PluginType.OscillatorPlugin:
            return "fx_oscillator.svg";
        case PluginType.InstrumentPlugin:
            return "fx_instrument.svg";
        case PluginType.MixerPlugin:
            return "fx_mixer.svg";
        case PluginType.PitchPlugin:
            return "fx_pitch.svg";
        case PluginType.SpatialPlugin:
            return "fx_spatial.svg";
        case PluginType.SpectralPlugin:
            return "fx_spectral.svg";
        case PluginType.AnalyserPlugin:
            return "fx_analyzer.svg";
        case PluginType.Plugin:
        default:
            return "fx_plugin.svg";
    }
}


export function SelectIconUri(plugin_type: PluginType) {
    let icon = SelectBaseIcon(plugin_type);
    return PiPedalModel.getInstance().svgImgUrl(icon);
}

const PluginIcon = withStyles((props: PluginIconProps) => {
    const { pluginType, opacity, pluginMissing,color } = props;
    const classes = withStyles.getClasses(props);

    let pluginMissing_: boolean = pluginMissing ?? false;

    let size: number = 24;
    if (props.size) size = props.size;
    let topVal: number = (props.offsetY ?? 0);

    let svgIcon = SelectSvgIcon(pluginType, classes.icon, size, opacity, pluginMissing_,color? color: "" );
    if (svgIcon) {
        return svgIcon;
    }

    // colored icons that don't have dark/light variants.
    return (
        <img src={SelectIconUri(pluginType)} className={classes.icon} style={{ width: size, height: size, position: "relative", top: topVal, opacity: " " }} alt=''
        />);

    // let maskText = "url(" + SelectIcon(pluginType, pluginUri) + ") no-repeat center";
    // let color=colorFromHash(pluginUri);
    // return (
    //     <div style={{ display: "block", opacity: 0.8, width: size, height: size, backgroundColor: color, 
    //         mask: maskText, WebkitMask: maskText, WebkitMaskSize: size + "px", maskSize: size + "px" }}
    //     >&nbsp;</div>
    // );
},
    styles);

export default PluginIcon;