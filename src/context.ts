import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import { decodeAuthHeader } from "./utils/auth";

export const prisma = new PrismaClient()
export interface Context {
	prisma: PrismaClient;
	userId?: number
}

export const context = ({ req }: { req: Request }): Context => {
	const token = req && req.headers.authorization
		? decodeAuthHeader(req.headers.authorization)
		: null;

	return {
		userId: token?.userId,
		prisma,
	}
}