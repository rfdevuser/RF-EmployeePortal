/*eslint complexity: ["error", 6]*/
// apolloClient.js

import { ApolloClient, InMemoryCache } from '@apollo/client';


const client = new ApolloClient({
  uri: 'https://www.onatiglobal.com/graphql', 
  cache: new InMemoryCache(),
});


export default client;
