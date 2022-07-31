import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  let body;
  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={4}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
  } else {
    //logged in
    body = (
      <Flex>
        <Box mr={4}>{data.me.username}</Box>
        <Button variant="link" fontWeight={"normal"}>
          Logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex p={8} bg="teal">
      <Box fontWeight="extrabold">LIREDDIT</Box>
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};
