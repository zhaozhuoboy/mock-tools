import { randomBytes, createHash, scrypt } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)

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
 * 生成盐值
 */
export const generateSalt = (): string => {
  return randomBytes(16).toString('hex')
}

/**
 * 密码加密 - 使用scrypt算法加盐加密
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = generateSalt()
  const hashedPassword = await scryptAsync(password, salt, 64) as Buffer
  return `${salt}:${hashedPassword.toString('hex')}`
}

/**
 * 验证密码
 */
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    const [salt, hash] = hashedPassword.split(':')
    const hashBuffer = Buffer.from(hash, 'hex')
    const derivedKey = await scryptAsync(password, salt, 64) as Buffer
    return derivedKey.equals(hashBuffer)
  } catch (error) {
    return false
  }
}

/**
 * 生成JWT密钥
 */
export const generateJwtSecret = (): string => {
  return randomBytes(64).toString('hex')
} 