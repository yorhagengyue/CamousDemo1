import { ApiError } from "@/types/common";

const API_BASE_URL = "/api";

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    ...init
  });

  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: await response.text()
    };
    throw error;
  }

  return (await response.json()) as T;
}

export async function apiPost<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    ...init
  });

  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: await response.text()
    };
    throw error;
  }

  return (await response.json()) as T;
}

export async function apiPatch<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    ...init
  });

  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: await response.text()
    };
    throw error;
  }

  return (await response.json()) as T;
}