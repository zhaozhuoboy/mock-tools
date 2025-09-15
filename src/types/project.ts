// 项目相关类型定义

export interface Project {
  id: number
  pid: number
  name: string
  description?: string
  host?: string
  owner_id: number
  created_at: string
  updated_at: string
}

export interface CreateProjectData {
  name: string
  description: string
  host: string
}

export interface ProjectResponse {
  code: number
  message: string
  data: Project[]
}

export interface CreateProjectResponse {
  code: number
  message: string
  data: Project
}
