import { withUrqlClient } from "next-urql";
import React from "react";
import NextLink from "next/link";
import { Box, Link } from "@chakra-ui/react";
import { Layout } from "../components/Layout";
import { NavBar } from "../components/NavBar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface indexProps {}

const index: React.FC<indexProps> = ({}) => {
  const [{ data }] = usePostsQuery();
  return (
    <Layout>
      <div>
        Hello there,{"\t"}
        <NextLink href="/create-post">
          <Link textColor={"teal"}>Create Post</Link>
        </NextLink>
      </div>

      <br />
      <Box mt={4}>
        {!data ? (
          <div>loading...</div>
        ) : (
          data.posts.map((p) => <div key={p.id}>{p.title}</div>)
        )}
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(index);
