# Apollo Refetch Queries

This module includes some helper functions to allow you to refetch queries by name.  It's been built against
Apollo Client 2.0.

Code originally taken from [Apollo Client issue 3540](https://github.com/apollographql/apollo-client/issues/3540#issuecomment-410911223)

# Installation

```
yarn add apollo-refetch-queries
```

```
npm i apollo-refetch-queries
```

# Usage

```javascript
import * as queries from 'apollo-refetch-queries'

const query = gql`
  query myNamedQuery {
    topLevelQuery
  }
`

queries.refetchQueriesByName(apolloClientInstance, ['myNamedQuery'])
```

# API

```refetchQueriesByName (client: ApolloClient<any>, queryNames: Array<string>): Promise<any>```

```refetchQueryByName (client: ApolloClient<any>, queryName: string): Promise<any>```

```refetchAllQueries (client: ApolloClient<any>): Promise<any>```
