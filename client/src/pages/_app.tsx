import { ChakraProvider } from "@chakra-ui/react";
import { createClient, dedupExchange, fetchExchange, Provider } from "urql";
import { cacheExchange, Cache, UpdatesConfig } from "@urql/exchange-graphcache";

import theme from "../theme";
import { AppProps } from "next/app";
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "../generated/graphql";

const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (result: LoginMutation, args, cache, info) => {
            cache.updateQuery({ query: MeDocument }, (data: MeQuery | null) => {
              if (result.login.errors) {
                return data;
              } else {
                return {
                  me: result.login.user,
                };
              }
            });
          },
          register: (result: RegisterMutation, args, cache, info) => {
            cache.updateQuery({ query: MeDocument }, (data: MeQuery | null) => {
              if (result.register.errors) {
                return data;
              } else {
                return {
                  me: result.register.user,
                };
              }
            });
          },
          logout: (result: LogoutMutation, args, cache, infor) => {
            cache.updateQuery({ query: MeDocument }, (data: MeQuery | null) => {
              return {
                me: null,
              };
            });
          },
        },
      },
    }),
    fetchExchange,
  ],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
