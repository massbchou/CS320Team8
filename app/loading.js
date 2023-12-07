import "./loading.css";

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
      }}
    >
      <div className="spinner">loading</div>;
    </div>
  );
}
