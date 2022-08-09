import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  const [serverStatus, setServerStatus] = useState(true);
  useEffect(() => setServerStatus(false));

  const [{ data, fetching }] = useMeQuery({
    pause: serverStatus,
  });

  let body = null;
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
        <Button
          onClick={() => {
            logout();
          }}
          isLoading={logoutFetching}
          variant="link"
          fontWeight={"normal"}
        >
          Logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex p={8} bg="teal" zIndex={1} position="sticky" top={0}>
      <Box fontWeight="extrabold">LIREDDIT</Box>
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};
