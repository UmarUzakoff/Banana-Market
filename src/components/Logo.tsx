import logo from "/logoBg.svg";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to={"/"} className="flex flex-row items-center gap-2">
      <img width={50} src={logo} alt="logo" />
      <h2
        style={{
          WebkitTextStroke: "0.2px black",
        }}
        className="font-yatra text-banana font-bold text-4xl">
        Banana Market
      </h2>
    </Link>
  );
};

export default Logo;
