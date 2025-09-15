import { randomBytes, createHash } from 'crypto'

/**
 * 生成唯一标识符
 */
export const generateUid = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    randomBytes(16, (err, buf) => {
      if (err) {
        reject(err)
        return
      }
      resolve(buf.toString('hex'))
    })
  })
}

/**
 * 生成随机字符串
 */
export const generateRandomString = (length: number = 32): string => {
  return randomBytes(length).toString('hex')
}

/**
 * 密码加密
 */
export const hashPassword = (password: string): string => {
  return createHash('sha256').update(password).digest('hex')
}

/**
 * 验证密码
 */
export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  const hashed = hashPassword(password)
  return hashed === hashedPassword
}

/**
 * 生成JWT密钥
 */
export const generateJwtSecret = (): string => {
  return randomBytes(64).toString('hex')
} 