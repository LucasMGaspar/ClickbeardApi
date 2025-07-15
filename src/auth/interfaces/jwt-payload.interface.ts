
export interface JwtPayload {
  sub: string 
  email: string
  role: 'CLIENT' | 'ADMIN'
  iat?: number
  exp?: number
}