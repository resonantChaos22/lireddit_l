import { cacheExchange } from "@urql/exchange-graphcache";
import { useRouter } from "next/router";
import { dedupExchange, Exchange, fetchExchange } from "urql";
import { pipe, tap } from "wonka";
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "../generated/graphql";

const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    const router = useRouter();
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error?.message.includes("Not Authenticated")) {
          router.push("/login");
        }
      })
    );
  };

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
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
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});
