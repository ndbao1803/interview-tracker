// lib/prisma/userService.ts
import { prisma } from './client'
export async function getAllCompanies() {
  return  await prisma.industry.findMany();
}