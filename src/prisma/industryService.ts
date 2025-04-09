// lib/prisma/userService.ts
import { prisma } from './client'
export async function getAllIndustries() {
  return  await prisma.industry.findMany();
}