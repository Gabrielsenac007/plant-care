import logo from "../assets/logo-reversa.svg"

export const Logo = ({ size = 100 }: { size?: number }) => (
  <img src={logo} alt="PlantLogo" width={size} height={size}/>
);
