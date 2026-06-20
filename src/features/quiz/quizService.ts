import type { Quiz, CreateQuizDTO, UpdateQuizDTO } from './types'

const API_URL = 'http://localhost:3000/api/quizzes'

// ─── helpers ────────────────────────────────────────────────────────────────

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message ?? `Request failed: ${res.status}`)
  }
  // 204 No Content (например, DELETE) не имеет тела — res.json() на пустом
  // теле кинет SyntaxError, поэтому возвращаем undefined вместо парсинга
  if (res.status === 204) {
    return undefined as T
  }
  return res.json()
}

// ─── Quiz CRUD ───────────────────────────────────────────────────────────────

export const quizService = {
  getAll(search?: string): Promise<Quiz[]> {
    const url = search ? `${API_URL}?search=${encodeURIComponent(search)}` : API_URL
    return request<Quiz[]>(url)
  },

  getById(id: string): Promise<Quiz> {
    return request<Quiz>(`${API_URL}/${id}`)
  },

  create(dto: CreateQuizDTO): Promise<Quiz> {
    return request<Quiz>(API_URL, {
      method: 'POST',
      body: JSON.stringify(dto),
    })
  },

  update(id: string, dto: UpdateQuizDTO): Promise<Quiz> {
    return request<Quiz>(`${API_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    })
  },

  delete(id: string): Promise<void> {
    return request<void>(`${API_URL}/${id}`, { method: 'DELETE' })
  },
}