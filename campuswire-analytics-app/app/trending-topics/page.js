import background from "../images/background.png";

export default function Page() {
  return (
    <main
      style={{
        backgroundImage: `url(${background.src})`,
        backgroundSize: "100%",
        backgroundRepeat: "no-repeat",
        height: "100vh",
      }}
    >
      <header>Trending Topics</header>
    </main>
  );
}
