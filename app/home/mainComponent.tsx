"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, BarChart3, CheckCircle, Clock, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InterviewSankeyDiagramDemo } from "./interview-sankey-chart"
import { AnimatedArrow } from "./animate-arrow"

export default function MainComponent() {
  return (
    <main className="bg-gradient-to-b from-background to-muted h-full">
      <section className="w-full py-12 md:py-24 lg:py-32 to-muted">
        <div className="container px-4 md:px-6">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-[50px] mb-40"
          >
            Interview-tracker
          </motion.h1>
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col justify-center space-y-4"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Track Your Interview Journey
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Never lose track of your job applications again. Monitor your progress, prepare for interviews, and
                  land your dream job.
                </p>
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col gap-2 min-[400px]:flex-row"
              >
                <Button size="lg">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  View Demo
                </Button>
              </motion.div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <Card className="w-full bg-opacity-45 bg-[#011627] relative">
                <CardHeader>
                  <CardTitle className="card-title">Your Application Progress</CardTitle>
                  <CardDescription>Track your journey from application to offer</CardDescription>
                </CardHeader>
                <CardContent className="w-full h-[400px] flex items-center justify-center">
                  <div className="sankey-diagram w-full h-full">
                    <InterviewSankeyDiagramDemo/>
                  </div>
                 
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Everything You Need to Succeed
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our comprehensive tools help you stay organized and prepared throughout your job search.
              </p>
            </div>
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3"
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center gap-4">
                    {index === 0 && <BarChart3 className="h-8 w-8 text-primary" />}
                    {index === 1 && <Clock className="h-8 w-8 text-primary" />}
                    {index === 2 && <CheckCircle className="h-8 w-8 text-primary" />}
                    <div className="grid gap-1">
                      <CardTitle>
                        {index === 0 ? "Track Progress" : index === 1 ? "Interview Prep" : "Success Metrics"}
                      </CardTitle>
                      <CardDescription>
                        {index === 0 ? "Monitor all your applications in one place" : index === 1 ? "Never miss an interview again" : "Visualize your job search journey"}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {index === 0 ? "Keep track of every application, interview stage, and follow-up in a centralized dashboard." : index === 1 ? "Get reminders for upcoming interviews and access preparation materials tailored to each role." : "Analyze your application success rates and identify areas for improvement with detailed analytics."}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  )
}