import React from 'react'
import { render } from 'react-dom'
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client'

import App from './App'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createHttpLink({
    uri: 'https://api.github.com/graphql',
    headers: {
      authorization: `Bearer ${process.env.GITHUB_APP_TOKEN}`,
    },
  }),
})

render(
  <ApolloProvider client={client}>
    <h1>Re-Read-em</h1>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
