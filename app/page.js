import Image from "next/image";
import { Young_Serif } from "next/font/google";
import ColorChangingButton from ".//colorChangingButton";

const youngSerif = Young_Serif({
  subsets: ["latin"],
  weight: "400",
});

export default async function Home() {
  return (
    <main
      style={{
        background:
          "radial-gradient(ellipse at center top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%), linear-gradient(140deg, rgba(240, 56, 255, .5) 0%, rgba(255,255,255, .5) 50%, rgba(0, 224, 255, .5) 100%)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: youngSerif,
            textAlign: "center",
            fontSize: "50px",
            marginLeft: "100px",
          }}
        >
          Welcome to <br></br> Campuswire Analytics! <br></br>
          <div
            style={{
              fontFamily: youngSerif,
              textAlign: "center",
              fontSize: "20px",
              marginTop: "20px",
            }}
          >
            A tool for educators to visualize Campuswire trends and user data to
            better address student needs.
          </div>
          <ColorChangingButton />
        </span>
        <Image
          src="/images/icon.png"
          width={400}
          height={400}
          quality={100}
          style={{ margin: "150px" }}
          unoptimized
          alt="campuswire logo"
        ></Image>
      </div>
    </main>
  );
}
