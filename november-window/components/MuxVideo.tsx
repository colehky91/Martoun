"use client";

import MuxPlayer from "@mux/mux-player-react";
import { useRef } from "react";

/**
 * Mux player that reports watch progress every ~10s of playback.
 * Progress lands in video_progress (current) and progress_events (history).
 */
export function MuxVideo({
  moduleId, playbackId, title,
}: { moduleId: string; playbackId: string; title: string }) {
  const lastSent = useRef(0);

  function report(current: number, duration: number) {
    if (!duration || current - lastSent.current < 10) return;
    lastSent.current = current;
    fetch("/api/video-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        moduleId,
        secondsWatched: Math.round(current),
        pctComplete: Math.round((current / duration) * 100),
      }),
    }).catch(() => {});
  }

  return (
    <MuxPlayer
      playbackId={playbackId}
      metadata={{ video_title: title }}
      accentColor="#FF7A1A"
      style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: 2 }}
      onTimeUpdate={(e) => {
        const el = e.currentTarget as HTMLVideoElement;
        report(el.currentTime, el.duration);
      }}
    />
  );
}
