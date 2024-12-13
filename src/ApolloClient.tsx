import { ApolloClient, InMemoryCache } from '@apollo/client';

const scAuth = import.meta.env.VITE_CG_SC_AUTH;
const damAuth = import.meta.env.VITE_CG_DAM_AUTH;

export const scClient = new ApolloClient({
  uri: `https://cg.optimizely.com/content/v2?auth=${scAuth}&cache=true`,
  cache: new InMemoryCache(),
});

export const damClient = new ApolloClient({
  uri: `https://cg.optimizely.com/content/v2?auth=${damAuth}&cache=true`,
  cache: new InMemoryCache(),
});
