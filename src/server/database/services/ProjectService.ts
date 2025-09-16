import { Project, ProjectAttributes, ProjectCreationAttributes } from '../models/Project'
import { Api, ApiAttributes, ApiCreationAttributes } from '../models/Api'

export class ProjectService {
  /**
   * 创建新项目
   */
  static async createProject(data: ProjectCreationAttributes): Promise<Project> {
    try {
      // 生成唯一的 pid：使用 MAX(pid) 避免默认值冲突，并在唯一冲突时重试
      const START_PID = 100000
      const getNextPid = async (): Promise<number> => {
        const maxPid = (await Project.max('pid')) as number | null
        if (typeof maxPid === 'number' && maxPid > 0) {
          return maxPid + 1
        }
        // 当表为空或历史脏数据导致 maxPid 无效时，从固定种子开始
        return START_PID
      }

      let attempts = 0
      const maxAttempts = 3
      // 重试创建，处理极端并发导致的唯一冲突
      /* eslint-disable no-constant-condition */
      while (true) {
        try {
          const nextPid = await getNextPid()
          const project = await Project.create({
            ...data,
            pid: nextPid
          })
          return project
        } catch (err: any) {
          const isUnique = err?.name === 'SequelizeUniqueConstraintError'
          const field = Array.isArray(err?.errors) ? err.errors[0]?.path || '' : ''
          if (isUnique && field.includes('pid') && attempts < maxAttempts) {
            attempts += 1
            continue
          }
          throw err
        }
      }
    } catch (error) {
      throw new Error(`创建项目失败: ${error}`)
    }
  }

  /**
   * 获取项目列表
   */
  static async getProjects(ownerId?: number): Promise<Project[]> {
    try {
      const where = ownerId ? { owner_id: ownerId } : {}
      const projects = await Project.findAll({
        where,
        order: [['created_at', 'DESC']]
      })
      return projects
    } catch (error) {
      throw new Error(`获取项目列表失败: ${error}`)
    }
  }

  /**
   * 根据ID获取项目
   */
  static async getProjectById(id: number): Promise<Project | null> {
    try {
      const project = await Project.findByPk(id)
      return project
    } catch (error) {
      throw new Error(`获取项目失败: ${error}`)
    }
  }

  /**
   * 根据PID获取项目
   */
  static async getProjectByPid(pid: number): Promise<Project | null> {
    try {
      const project = await Project.findOne({
        where: { pid }
      })
      return project
    } catch (error) {
      throw new Error(`获取项目失败: ${error}`)
    }
  }

  /**
   * 更新项目
   */
  static async updateProject(id: number, data: Partial<ProjectAttributes>): Promise<Project | null> {
    try {
      const project = await Project.findByPk(id)
      if (!project) {
        return null
      }

      await project.update(data)
      return project
    } catch (error) {
      throw new Error(`更新项目失败: ${error}`)
    }
  }

  /**
   * 删除项目
   */
  static async deleteProject(id: number): Promise<boolean> {
    try {
      const project = await Project.findByPk(id)
      if (!project) {
        return false
      }

      await project.destroy()
      return true
    } catch (error) {
      throw new Error(`删除项目失败: ${error}`)
    }
  }
}

export class ApiService {
  static async listByProject(projectId: number): Promise<Api[]> {
    return Api.findAll({ where: { project_id: projectId }, order: [['created_at', 'DESC']] })
  }
  /**
   * 创建接口
   * @param projectId 项目ID
   * @param data 接口数据
   * @returns 创建的接口
   */
  static async create(projectId: number, data: ApiCreationAttributes): Promise<Api> {
    return Api.create({ ...data, project_id: projectId })
  }
  /**
   * 更新接口
   * @param id 接口ID
   * @param data 接口数据
   * @returns 
   */
  static async update(id: number, data: Partial<ApiAttributes>): Promise<Api | null> {
    const api = await Api.findByPk(id)
    if (!api) {
      return null
    }
    await api.update({ ...data })
    return api
  }

  /**
   * 删除接口
   * @param id 接口ID
   * @returns 
   */
  static async deleteApi(id: number): Promise<Api | null> {
    const api = await Api.findByPk(id)
    if (!api) {
      return null
    }
    await api.destroy()
    return api
  }
  /**
   * 统计接口数量
   * @param projectId 项目ID
   * @returns 接口数量
   */
  static async countByProject(projectId: number): Promise<number> {
    return Api.count({ where: { project_id: projectId } })
  }
}
