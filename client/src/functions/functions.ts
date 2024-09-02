//Functions for linkToDeviceScreen
import axios, { AxiosResponse } from 'axios'
import { client, config } from '../axios/axios'

export interface LinkDevicesResponseType {
  linked: boolean
  message: string
}

export interface isDeviceSubscribedResponseType {
  message: string
  isSubscribed: boolean
}

export interface addSenderToTheDeviceConnectionListResponse {
  data: string
  connected: boolean
}
export const checkDeviceIsSubscribed = async (
  deviceIdToBeChecked: string,
): Promise<isDeviceSubscribedResponseType> => {
  try {
    const response: AxiosResponse = await client.get(
      `/api/subscription/subscribeddevice/${deviceIdToBeChecked}`,
    )

    const { message, subscribed } = response.data
    let successMessage = { message: message, isSubscribed: subscribed }

    return successMessage
  } catch (error) {
    let errorMessage = { message: '', isSubscribed: false }
    return errorMessage
  }
}

// Check Sender_Device is subscribed to notifications
// Check Receiver is Subscribed To Notifications
// Add Receiver device to the  sender connections list
// Add Sender device to the receiver device connections list
export const linkDevices = async (
  currentDeviceId: string,
  receiverDeviceID: string,
): Promise<LinkDevicesResponseType> => {
  try {
    const checkDeviceIsSubscribedResponse: isDeviceSubscribedResponseType = await checkDeviceIsSubscribed(
      currentDeviceId,
    )

    if (checkDeviceIsSubscribedResponse.isSubscribed === false) {
      let response = {
        message:
          'You are not subscribed to notifications. Subscribe to send notifications to the connections',
        linked: false,
      }
      return response
    }

    const canReceiverDeviceBeLinkedResponse = await canReceiverDeviceBeLinked(
      currentDeviceId,
      receiverDeviceID,
    )

    return canReceiverDeviceBeLinkedResponse
  } catch (error) {
    console.error(error)
    return {
      message: '',
      linked: false,
    }
  }
}

export const canReceiverDeviceBeLinked = async (
  currentDeviceId: string,
  receiverDeviceID: string,
): Promise<LinkDevicesResponseType> => {
  // Check Receiver is Subscribed To Notifications

  try {
    const checkDeviceIsSubscribedResponse: isDeviceSubscribedResponseType = await checkDeviceIsSubscribed(
      receiverDeviceID,
    )
    if (checkDeviceIsSubscribedResponse.isSubscribed === false) {
      let response = {
        message:
          'The receiving device needs to subscribe to notifications to receive messages',
        linked: false,
      }
      return response
    }

    return addSenderAndReceiverToTheDeviceConnectionList(
      currentDeviceId,
      receiverDeviceID,
    )
  } catch (error) {
    return {
      message: '',
      linked: false,
    }
  }
}

export const addSenderAndReceiverToTheDeviceConnectionList = async (
  currentDeviceId: string,
  receiverDeviceID: string,
): Promise<LinkDevicesResponseType> => {
  try {
    const response = await addSenderToTheDeviceConnectionList(
      currentDeviceId,
      receiverDeviceID,
    )
    const { connected, data } = response

    if (!connected) {
      let response: LinkDevicesResponseType = {
        message: data,
        linked: false,
      }
      return response
      // return addSenderToTheDeviceConnectionListResponse.data;
    }

    return addReceiverToTheDeviceConnectionList(
      currentDeviceId,
      receiverDeviceID,
    )
  } catch (error) {
    return {
      message: '',
      linked: false,
    }
  }
}

export const addSenderToTheDeviceConnectionList = async (
  currentDeviceId: string,
  receiverDeviceID: string,
): Promise<addSenderToTheDeviceConnectionListResponse> => {
  try {
    let device_id = receiverDeviceID
    let receivingDeviceId = currentDeviceId

    const response: AxiosResponse = await client.post(
      `/api/connections/${device_id}`,
      {
        ...config,
        params: {
          receivingDeviceId,
        },
      },
    )

    const { data, connected } = response.data
    let successMessage = { data: data, connected: connected }
    return successMessage
  } catch (error) {
    let errorMessage = {
      data: 'Unable to add the device to the connection list',
      connected: false,
    }
    return errorMessage
    // return false;
  }
}

export const addReceiverToTheDeviceConnectionList = async (
  currentDeviceId: string,
  receiverDeviceID: string,
): Promise<LinkDevicesResponseType> => {
  try {
    let device_id = currentDeviceId
    let receivingDeviceId = receiverDeviceID

    const addReceiverToListResponse: AxiosResponse = await client.post(
      `/api/connections/${device_id}`,
      {
        ...config,
        params: {
          receivingDeviceId,
        },
      },
    )
    const { data, connected } = addReceiverToListResponse.data
    return {
      message: data,
      linked: connected,
    }
  } catch (error) {
    let errorMessage = {
      message: '',
      linked: false,
    }
    return errorMessage
    // return false;
  }
}
