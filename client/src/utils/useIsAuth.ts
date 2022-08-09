import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = (path: string) => {
  const router = useRouter();
  const [{ data, fetching }] = useMeQuery(); //  urql doesnt fetch again, it just caches it.

  useEffect(() => {
    if (!fetching && !data?.me) router.replace("/login?next=" + path);
  }, [fetching, data, router]);
};
