import PodiumStep from "./PodiumStep";

export default function Podium({ winners }) {
  const podium = [4, 2, 0, 1, 3, 5]
    .reduce((podiumOrder, position) => [...podiumOrder, winners[position]], [])
    .filter(Boolean);

  return (
    <div
      style={{
        display: "grid",
        gridAutoFlow: "column dense",
        gap: ".5rem",
        marginTop: "2rem",
        justifyContent: "center",
        justifyItems: "center",
        alignContent: "flex-end",
        alignItems: "flex-end",
        height: 250,
        width: 350,
      }}
    >
      {podium.map((winner) => (
        <PodiumStep key={winner.position} podium={podium} winner={winner} />
      ))}
    </div>
  );
}
