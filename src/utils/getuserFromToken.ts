import Jwt from "jsonwebtoken"
import { JWT_SIGNTURE } from "../keys"

export const getUserFromToken = async (token: string) => {
    try {
        return await Jwt.verify(token, JWT_SIGNTURE) as {
            userId: number
        }
    } catch (error) {
        return null
    }
}