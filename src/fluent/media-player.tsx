import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { FluentIcon } from "./controls";
export function MediaPlayer() {
  const video = useRef<HTMLVideoElement>(null),
    [playing, setPlaying] = useState(false),
    [position, setPosition] = useState(0),
    [duration, setDuration] = useState(0),
    [muted, setMuted] = useState(false);
  const format = (n: number) =>
    `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`;
  return (
    <div className="media-player">
      <video
        ref={video}
        src="/fluent-motion.webm"
        poster="/fluent-landscape.svg"
        playsInline
        aria-label="Fluent motion study 示例视频"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => {
          if (Number.isFinite(e.currentTarget.duration))
            setPosition(
              (e.currentTarget.currentTime / e.currentTarget.duration) * 100,
            );
        }}
      />
      <div className="media-controls">
        <Button
          variant="ghost"
          aria-label={playing ? "暂停" : "播放"}
          onClick={() => {
            const v = video.current;
            if (v) {
              if (v.paused) void v.play();
              else v.pause();
            }
          }}
        >
          <FluentIcon name={playing ? "pause" : "play"} />
        </Button>
        <Slider
          aria-label="播放进度"
          value={[position]}
          onValueChange={(n) => {
            const next = Array.isArray(n) ? n[0] : n;
            setPosition(next);
            if (video.current && Number.isFinite(video.current.duration))
              video.current.currentTime = (next / 100) * video.current.duration;
          }}
        />
        <time>
          {format((position / 100) * duration)} /{" "}
          {format(Number.isFinite(duration) ? duration : 3)}
        </time>
        <button
          className="icon-btn"
          aria-label={muted ? "取消静音" : "静音"}
          aria-pressed={muted}
          onClick={() => {
            setMuted(!muted);
            if (video.current) video.current.muted = !muted;
          }}
        >
          <FluentIcon name="volume" />
        </button>
        <button
          className="icon-btn"
          aria-label="全屏"
          onClick={() => {
            void video.current?.requestFullscreen();
          }}
        >
          <FluentIcon>{"\uE740"}</FluentIcon>
        </button>
      </div>
    </div>
  );
}
