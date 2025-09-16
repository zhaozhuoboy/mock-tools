// API 详情数据类型
export interface ApiDetail {
  id: string
  api_id: string
  name: string
  payload: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// API 详情创建参数
export interface ApiDetailCreateParams {
  apiId: string
  name: string
  payload: string | object
}

// API 详情更新参数
export interface ApiDetailUpdateParams {
  id: string
  name?: string
  payload?: string | object
  is_active?: boolean
}

// API 详情删除参数
export interface ApiDetailDeleteParams {
  id: string
}

// 设置活跃数据参数
export interface ApiDetailSetActiveParams {
  id: string
}

// API 信息响应
export interface ApiInfoResponse {
  success: boolean
  data: {
    api: {
      id: string
      project_id: string
      path: string
      method: string
      group?: string
      description?: string
      created_at: string
      updated_at: string
      project?: {
        name: string
        host?: string
      }
    }
    details: ApiDetail[]
    activeDetailId?: string | null
  }
}

// API 详情操作响应
export interface ApiDetailResponse {
  success: boolean
  data: ApiDetail
  message?: string
}

// API 详情列表响应
export interface ApiDetailListResponse {
  success: boolean
  data: ApiDetail[]
}
