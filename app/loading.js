import { CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <div
      style={{
        background:
          "radial-gradient(ellipse at center top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%), linear-gradient(140deg, rgba(240, 56, 255, .5) 0%, rgba(255,255,255, .5) 50%, rgba(0, 224, 255, .5) 100%)",
        backgroundsize: "cover",
        backgroundrepeat: "no-repeat",
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 224, 255, 1)" />
            <stop offset="100%" stopColor="rgba(240, 56, 255, 1)" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress
        sx={{ "svg circle": { stroke: "url(#gradient)" } }}
        size={60}
      />
    </div>
  );
}
