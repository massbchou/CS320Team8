import Link from "next/link";
// Returns a formatted Feature component for the Overview tab given a title and some data
export default function Feature(props) {
  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 242, 255, 0.65), rgba(255, 0, 242, 0.65))",
        borderRadius: "10px",
        padding: "20px",
        margin: "20px",
        width: "350px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontFamily: "Young Serif",
          fontSize: "25px",
          backgroundColor: "rgba(255, 255, 255, 0.70)",
          borderRadius: "10px",
          padding: "3px",
          marginBottom: "9px",
        }}
      >
        {props.title}
      </div>
      {props.content.map((x, i) => (
        <div
          key={i + "a"}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span
            key={i + "b"}
            style={{
              fontFamily: "Young Serif",
              fontSize: "20px",
              textAlign: "center",
              margin: "6px",
              padding: "2px",
              backgroundColor: "rgba(255, 255, 255, 1)",
              opacity: "0.6",
              borderRadius: "7px",
              width: "10%",
            }}
          >
            {i + 1}
          </span>
          <span
            key={i + "c"}
            style={{
              fontFamily: "Young Serif",
              fontSize: "20px",
              textAlign: "center",
              margin: "6px",
              padding: "2px",
              backgroundColor: "rgba(255, 255, 255, 1)",
              opacity: "0.6",
              borderRadius: "7px",
              width: "70%",
            }}
          >
            {x}
          </span>
        </div>
      ))}
      <div style={{ textAlign: "center" }}>
        {
          <Link
            href={"/" + props.linkTo}
            style={{
              padding: "0px 10px 10px",
              fontFamily: "Young Serif",
              fontSize: "30px",
              textAlign: "center",
              backgroundColor: "rgba(205, 197, 248, 1)",
              color: "gray",
              borderRadius: "7px",
            }}
          >
            ...
          </Link>
        }
      </div>
    </div>
  );
}
//if the length of map is only 3 then add the ranking medals instead of the number?
