import { Box } from "@chakra-ui/react";
import React from "react";

interface WrapperProps {
  children?: React.ReactNode;
  variant?: "small" | "regular";
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = "regular" }) => {
  return (
    <Box mt={8} mx="auto" maxW={variant == "regular" ? "80vw" : "40vw"}>
      {children}
    </Box>
  );
};

export default Wrapper;
