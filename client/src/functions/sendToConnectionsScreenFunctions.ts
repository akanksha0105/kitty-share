import { AxiosResponse } from 'axios'
import { client, config } from '../axios/axios'

export interface getConnectionsResponseType<T> {
  data: T[]
  connectionsExists: boolean
}

export const getConnections = async <T>(
  deviceId: string,
): Promise<getConnectionsResponseType<T>> => {
  try {
    const getConnectionsResponse: AxiosResponse = await client.get(
      `/api/connections/getAllConnections/${deviceId} `,
      config,
    )
    let { data } = getConnectionsResponse.data

    let getConnectionsOutput = { data: data, connectionsExists: true }
    return getConnectionsOutput
  } catch (error) {
    return {
      data: [],
      connectionsExists: false,
    }
  }
}
