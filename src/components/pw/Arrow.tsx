"use client";

import { useId, useMemo } from "react";

type ArrowProps = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  fromColor: string;
  toColor?: string;
  strokeWidth?: number;
  bend?: number;
  startInset?: number;
  endInset?: number;
  className?: string;
  viewBox?: string;
  preserveAspectRatio?: string;
};

function getControlPoint(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  bend: number,
) {
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const dx = endX - startX;
  const dy = endY - startY;

  if (Math.abs(dx) < 0.5) {
    return { x: midX + bend, y: midY };
  }

  if (Math.abs(dy) < 0.5) {
    return { x: midX, y: midY + bend };
  }

  const length = Math.hypot(dx, dy);
  const perpX = -dy / length;
  const perpY = dx / length;
  const outward = dx > 0 ? 1 : -1;

  return {
    x: midX + perpX * bend * outward,
    y: midY + perpY * bend * outward,
  };
}

function insetCurvePoint(
  t: number,
  inset: number,
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x1: number,
  y1: number,
  fromEnd: boolean,
) {
  const mt = 1 - t;
  const px = mt * mt * x0 + 2 * mt * t * cx + t * t * x1;
  const py = mt * mt * y0 + 2 * mt * t * cy + t * t * y1;
  let dx = 2 * mt * (cx - x0) + 2 * t * (x1 - cx);
  let dy = 2 * mt * (cy - y0) + 2 * t * (y1 - cy);
  const length = Math.hypot(dx, dy) || 1;
  dx /= length;
  dy /= length;

  if (fromEnd) {
    return { x: px - dx * inset, y: py - dy * inset };
  }

  return { x: px + dx * inset, y: py + dy * inset };
}

export default function Arrow({
  startX,
  startY,
  endX,
  endY,
  fromColor,
  toColor = fromColor,
  strokeWidth = 3.5,
  bend = 16,
  startInset = 0,
  endInset = 0,
  className = "h-full w-full",
  viewBox = "0 0 100 80",
  preserveAspectRatio = "xMidYMid meet",
}: ArrowProps) {
  const id = useId().replace(/:/g, "");
  const gradientId = `arrow-grad-${id}`;
  const markerId = `arrow-head-${id}`;
  const isSplit = fromColor !== toColor;

  const control = useMemo(
    () => getControlPoint(startX, startY, endX, endY, bend),
    [startX, startY, endX, endY, bend],
  );

  const lineStart = useMemo(
    () =>
      startInset > 0
        ? insetCurvePoint(
            0,
            startInset,
            startX,
            startY,
            control.x,
            control.y,
            endX,
            endY,
            false,
          )
        : { x: startX, y: startY },
    [startX, startY, endX, endY, control.x, control.y, startInset],
  );

  const lineEnd = useMemo(
    () =>
      endInset > 0
        ? insetCurvePoint(
            1,
            endInset,
            startX,
            startY,
            control.x,
            control.y,
            endX,
            endY,
            true,
          )
        : { x: endX, y: endY },
    [startX, startY, endX, endY, control.x, control.y, endInset],
  );

  const path = `M ${lineStart.x} ${lineStart.y} Q ${control.x} ${control.y} ${lineEnd.x} ${lineEnd.y}`;

  return (
    <svg
      className={className}
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      overflow="visible"
      aria-hidden
    >
      <defs>
        {isSplit ? (
          <linearGradient
            id={gradientId}
            gradientUnits="userSpaceOnUse"
            x1={lineStart.x}
            y1={lineStart.y}
            x2={lineEnd.x}
            y2={lineEnd.y}
          >
            <stop offset="0%" stopColor={fromColor} />
            <stop offset="50%" stopColor={fromColor} />
            <stop offset="50%" stopColor={toColor} />
            <stop offset="100%" stopColor={toColor} />
          </linearGradient>
        ) : null}
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="1"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M 0.5 0.5 L 9.5 5 L 0.5 9.5 Z" fill={toColor} />
        </marker>
      </defs>
      <path
        d={path}
        fill="none"
        stroke={isSplit ? `url(#${gradientId})` : fromColor}
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
        strokeLinejoin="round"
        markerEnd={`url(#${markerId})`}
      />
    </svg>
  );
}
