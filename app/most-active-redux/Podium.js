import PodiumStep from "./PodiumStep";

//This code was adapted from https://medium.com/geekculture/how-to-animate-a-winners-podium-88fab739e686

// The Podium component takes an array of winners and displays them in podium order
export default function Podium({ winners }) {
  // Creates a proper ordering of podium of winners
  // Rearranges winners based on positions
  const podium = [4, 2, 0, 1, 3, 5]
    .reduce((podiumOrder, position) => [...podiumOrder, winners[position]], [])
    .filter(Boolean); // Filters out any potential empty values

  //Returns the 5 animations that will play for each of the 5 podium winners
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
      {/* Maps through each winner to create PodiumStep components */}
      {podium.map((winner) => (
        <PodiumStep key={winner.position} podium={podium} winner={winner} />
      ))}
    </div>
  );
}
