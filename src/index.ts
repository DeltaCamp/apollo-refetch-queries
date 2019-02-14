import { ApolloClient } from 'apollo-client'
import { compact, flatten, map, values } from 'lodash'

export const isObservableQueryRefetchable = (observableQuery: any): boolean => observableQuery.options.fetchPolicy !== 'cache-only'

export const getObservableQueriesByName = (client: ApolloClient<any>, queryName: string): Array<Object> => {
  const queryManager: any = client.queryManager
  const { queries, queryIdsByName } = queryManager
  const queryIds = queryIdsByName[queryName] || []
  return map(queryIds, (queryId: string) => queries.get(queryId).observableQuery)
}

export const getAllObservableQueries = (client: ApolloClient<any>): Array<Object> => {
  const queryManager: any = client.queryManager
  const { queries, queryIdsByName } = queryManager
  const queryIds = flatten(values(queryIdsByName))
  return map(queryIds, (queryId: string) => queries.get(queryId).observableQuery)
}

export const refetchQueriesByName = (client: ApolloClient<any>, queryNames: Array<string>) =>
  Promise.all(map(queryNames, (queryName: string) => refetchQueryByName(client, queryName)))

// We're re-writing QueryManager refetchQueryByName to be less brittle:
// https://github.com/apollographql/apollo-client/blob/88a77511467b2735e841df86073ee3af51e88eec/src/core/QueryManager.ts#L1004
export const refetchQueryByName = (client: ApolloClient<any>, queryName: string) => {
  const refetchedQueries = getObservableQueriesByName(client, queryName)

  return refetchObservableQueries(refetchedQueries)
}

export const refetchAllQueries = (client: ApolloClient<any>) => {
  const refetchedQueries = getAllObservableQueries(client)

  return refetchObservableQueries(refetchedQueries)
}

export const refetchObservableQueries = (refetchedQueries: Array<Object>) => {
  const promises = compact(map(refetchedQueries, (observableQuery: any) => {
    if (isObservableQueryRefetchable(observableQuery)) {
      return observableQuery.refetch()
    }
  }))

  return Promise.all(promises)
}
