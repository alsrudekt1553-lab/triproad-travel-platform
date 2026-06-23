import axios from "axios"
import { API_SERVER_HOST } from "./apiConfig"

const prefix = `${API_SERVER_HOST}/api/admin`

export const getBookingList = async (): Promise<Admin01Booking[]> => {
  const res = await axios.get(`${prefix}/bookingList`, {
  withCredentials: true
})
  return res.data
}

export const postAddProduct = async (formData: FormData) => {
  const res = await axios.post(`${prefix}/addProduct`, formData, {
  withCredentials: true
})
  return res.data
}

export const postAddSchedule = async (formData: FormData) => {
  const res = await axios.post(`${prefix}/addSchedule`, formData, {
  withCredentials: true
})
  return res.data
}

export const getAdminProductList = async (): Promise<Admin01Product[]> => {
  const res = await axios.get(`${prefix}/productList`, {
  withCredentials: true
})
  return res.data
}

export const getAdminRegionList = async (): Promise<Admin01Region[]> => {
  const res = await axios.get(`${prefix}/regionList`, {
  withCredentials: true
})
  return res.data
}

export const getAdminThemeList = async (): Promise<Admin01Theme[]> => {
  const res = await axios.get(`${prefix}/themeList`, {
  withCredentials: true
})
  return res.data
}

export const getAdminProductDetail = async (
  productId: number
): Promise<Admin01Product> => {
  const res = await axios.get(`${prefix}/product/${productId}`, {
    withCredentials: true
  })

  return res.data
}

export const getAdminScheduleList = async (
  productId: number
): Promise<Admin01Schedule[]> => {
  const res = await axios.get(`${prefix}/scheduleList/${productId}`, {
    withCredentials: true
  })

  return res.data
}

export const postModifyProduct = async (formData: FormData) => {
  const res = await axios.post(`${prefix}/modifyProduct`, formData, {
    withCredentials: true
  })

  return res.data
}

export const postModifySchedule = async (formData: FormData) => {
  const res = await axios.post(`${prefix}/modifySchedule`, formData, {
    withCredentials: true
  })

  return res.data
}