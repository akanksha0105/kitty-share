import axios, { AxiosError, AxiosResponse } from 'axios'
import { client, config } from '../axios/axios'
import {
  checkDeviceIsSubscribed,
  isDeviceSubscribedResponseType,
} from './functions'

export type retrieveMessageType = {
  data: string
  device: string
  messageRetrieved: boolean
}

export interface getReceiverDeviceNameResponseType {
  message: string
  receiverDeviceName?: string
  retrievedDeviceName: boolean
}

export interface checkDeviceIsAnExistingConnectionResponseType {
  message: string
  connectionexists: boolean
}

export interface getRecieverDeviceDetails {
  receiverDeviceId?: string
  retrievedDeviceId: boolean
  message: string
}

export interface checkIfDeviceCanBeAddedAsConnectionResponse {
  canBeAddedAsConnection: boolean
  deviceToBeAdded?: string
}

export const getReceiverDeviceName = async (
  receiverDeviceId: string,
): Promise<getReceiverDeviceNameResponseType> => {
  try {
    let deviceId = receiverDeviceId
    const getReceiverDeviceNameResponse: AxiosResponse = await client.get(
      `/api/devices/searchdevicename/${deviceId}`,
      config,
    )

    return {
      message: "Retrieved Receiver's Device Name",
      receiverDeviceName: getReceiverDeviceNameResponse.data.deviceName,
      retrievedDeviceName: true,
    }
  } catch (error) {
    return {
      message: 'Device name not found',
      retrievedDeviceName: false,
    }
  }
}

export const checkReceiverDeviceName = async (
  receiverDeviceName: string,
): Promise<getRecieverDeviceDetails> => {
  try {
    const deviceName = receiverDeviceName
    const receiverDeviceNameResponse: AxiosResponse = await client.get(
      `/api/devices/searchdeviceid/${deviceName}`,
    )
    return {
      receiverDeviceId: receiverDeviceNameResponse.data.deviceId,
      retrievedDeviceId: true,
      message: 'successfully retrieved device name',
    }
  } catch (error) {
    return {
      message: 'Internal Error in retrieving Device Name',
      retrievedDeviceId: false,
    }
  }
}

export const retrieveMessage = async (
  codeInputValue: string,
): Promise<retrieveMessageType> => {
  try {
    const codedMessage = codeInputValue

    const retrievedMessagePromiseResponse: AxiosResponse = await client.get(
      `/api/code/geturl/${codedMessage}`,
      config,
    )

    const { data, device } = retrievedMessagePromiseResponse.data
    let successMessage: retrieveMessageType = {
      data: data,
      device: device,
      messageRetrieved: true,
    }
    return successMessage
  } catch (err) {
    let errorMessage: retrieveMessageType = {
      data: 'Unable to retrieve Message',
      messageRetrieved: false,
      device: '',
    }

    return errorMessage
  }
}

export const checkIfDeviceCanBeAddedAsConnection = async (
  currentDeviceId: string,
  device: string,
): Promise<checkIfDeviceCanBeAddedAsConnectionResponse> => {
  try {
    if (currentDeviceId.localeCompare(device) === 0)
      return { canBeAddedAsConnection: false }

    // check if there is a connection already present between both the devices
    const response = await checkDeviceIsAnExistingConnection(
      currentDeviceId,
      device,
    )

    if (response) return { canBeAddedAsConnection: false }
    return areBothSenderAndReceiverSubscribed(currentDeviceId, device)
  } catch (error) {
    return { canBeAddedAsConnection: false }
  }
  //check if both the sending and the receiving devices are subscribed to notifications
}

const areBothSenderAndReceiverSubscribed = async (
  currentDeviceId: string,
  device: string,
): Promise<checkIfDeviceCanBeAddedAsConnectionResponse> => {
  try {
    const response: isDeviceSubscribedResponseType = await checkDeviceIsSubscribed(
      currentDeviceId,
    )

    if (response.isSubscribed === false) {
      return { canBeAddedAsConnection: false }
    }
    return checkReceiverDeviceIsSubscribed(device)
  } catch (error) {
    return { canBeAddedAsConnection: false }
  }
}

const checkReceiverDeviceIsSubscribed = async (
  device: string,
): Promise<checkIfDeviceCanBeAddedAsConnectionResponse> => {
  try {
    const checkDeviceIsSubscribedResponse: isDeviceSubscribedResponseType = await checkDeviceIsSubscribed(
      device,
    )
    if (checkDeviceIsSubscribedResponse.isSubscribed === false) {
      return { canBeAddedAsConnection: false }
    }
    return { canBeAddedAsConnection: true, deviceToBeAdded: device }
  } catch (error) {
    return { canBeAddedAsConnection: false }
  }
}

export const checkDeviceIsAnExistingConnection = async (
  currentDeviceId: string,
  receiverDeviceId: string,
): Promise<checkDeviceIsAnExistingConnectionResponseType> => {
  try {
    const connectionExistsResponse: AxiosResponse = await client.get(
      `/api/connections/checkifconnected/${currentDeviceId}/${receiverDeviceId}`,
    )

    const checkDeviceIsAnExistingConnectionResponse: checkDeviceIsAnExistingConnectionResponseType = {
      message: '',
      connectionexists: connectionExistsResponse.data.connectionexists,
    }

    return checkDeviceIsAnExistingConnectionResponse
  } catch (error) {
    console.error('Unable to check if both the devices are connected', error)
    const checkDeviceIsAnExistingConnectionResponseError: checkDeviceIsAnExistingConnectionResponseType = {
      message: 'Unable to check if both the devices are connected',
      connectionexists: false,
    }
    return checkDeviceIsAnExistingConnectionResponseError
  }
}
