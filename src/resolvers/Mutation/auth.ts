import { Context } from "../..";
import validator from "validator"
import bcrypt from "bcryptjs"
import Jwt from "jsonwebtoken";
import { JWT_SIGNTURE } from "../../keys";
interface SignUpArgs {
    credentials: {
        password: string
        email: string;
    }

    name: string;
    bio: string

}


interface UserPayload {
    userErrors: {
        message: string
    }[]
    token: string | null
}
export const authResolvers = {
    signUp: async (__: any, { bio, credentials, name, }: SignUpArgs, { prisma }: Context): Promise<UserPayload> => {
        const { email, password } = credentials
        const isEmail = validator.isEmail(email);

        if (!isEmail) {
            return {
                userErrors: [
                    {
                        message: "Invalid email",
                    },
                ],
                token: null,
            };
        }

        const isValidPassword = validator.isLength(password, {
            min: 5,
        });

        if (!isValidPassword) {
            return {
                userErrors: [
                    {
                        message: "Invalid password",
                    },
                ],
                token: null,
            };
        }
        if (!name || !bio) {
            return {
                userErrors: [
                    {
                        message: "Invalid name or bio",
                    },
                ],
                token: null,
            };
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        })
        await prisma.profile.create({
            data: {
                bio,
                userId: user.id
            }
        })

        const token = await Jwt.sign({
            userID: user.id,
            email: user.email
        }, JWT_SIGNTURE, {
            expiresIn: 3600000
        })

        return {
            userErrors: [],
            token
        }
    },
    signIn: async (__: any, { credentials }: Pick<SignUpArgs, 'credentials'>, { prisma }: Context): Promise<UserPayload> => {
        const { email, password } = credentials
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            return {
                userErrors: [
                    {
                        message: "Invalid email",
                    },
                ],
                token: null,
            };
        }

        const ifPasswordMatch = await bcrypt.compare(password, user.password)

        if (!ifPasswordMatch) {
            return {
                userErrors: [
                    {
                        message: "Invalid password",
                    },
                ],
                token: null,
            };
        }
        const token = await Jwt.sign({
            userID: user.id,
        }, JWT_SIGNTURE, {
            expiresIn: 3600000
        })
        return {
            userErrors: [
                {
                    message: "",
                },
            ],
            token,
        };
    }
}