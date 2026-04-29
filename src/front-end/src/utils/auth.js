import { storageKeys } from "@/constants/storage-keys";

const AUTH_STORAGE_KEY = storageKeys.accessToken

export function persistAuthSession(payload) {
  const token =
    payload?.token ?? payload?.accessToken ?? payload?.data?.token ?? 'authenticated'

  localStorage.setItem(AUTH_STORAGE_KEY, token)
}

export function getAccessToken() {
  return localStorage.getItem(AUTH_STORAGE_KEY)
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem(AUTH_STORAGE_KEY))
}
