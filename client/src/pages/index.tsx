import React from "react";
import { NavBar } from "../components/NavBar";

interface indexProps {}

const index: React.FC<indexProps> = ({}) => {
  return (
    <>
      <NavBar />
      <div>Hello there</div>
    </>
  );
};

export default index;
