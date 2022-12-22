import { useEffect } from "react";
import {
  FetchResult,
  Observer,
  SubscriptionOptions,
  useApolloClient,
} from "@apollo/client";

export function useSubscription(
  subscription: SubscriptionOptions,
  observer: Observer<FetchResult>
) {
  const client = useApolloClient();

  useEffect(() => {
    const observable = client.subscribe(subscription).subscribe(observer);

    return () => {
      observable.unsubscribe();
    };
  }, []);
}
