"use client"

import { ResponsiveSankey } from "@nivo/sankey"
import { useEffect, useState } from "react"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { motion, AnimatePresence } from "framer-motion"

export function InterviewSankeyDiagramDemo() {
  
  const [links, setLinks] = useState([
    // Level 0 -> Level 1
    { source: "Total Applicants", target: "Pending", value: 30 },
    { source: "Total Applicants", target: "First Round", value: 40 },
    { source: "Total Applicants", target: "Rejected Initial", value: 30 },

    // Level 1 -> Level 2
    { source: "First Round", target: "Second Round", value: 20 },
    { source: "First Round", target: "Rejected First", value: 20 },

    // Level 2 -> Level 3
    { source: "Second Round", target: "Final Round", value: 8 },
    { source: "Second Round", target: "Rejected Second", value: 12 },
    // Level 3 -> Level 4
 
    { source: "Final Round", target: "Rejected Final", value: 8 },
  ])

  const [showOffer, setShowOffer] = useState(false)
  const [showArrow, setShowArrow] = useState(false)

  // Define the nodes (interview stages) grouped by levels
  const nodes = [
    // Level 0 - Starting point
    { id: "Total Applicants", label: "Total Applicants" },
    
    // Level 1 - Initial distribution
    { id: "Pending", label: "Pending " },
    { id: "First Round", label: "First Round" },
    { id: "Rejected Initial", label: "Rejected" },
    
    // Level 2 - First round outcomes
    { id: "Second Round", label: "Second Round" },
    { id: "Rejected First", label: "Rejected" },
    
    // Level 3 - Second round outcomes
    { id: "Final Round", label: "Final Round" },
    { id: "Rejected Second", label: "Rejected" },
    
    // Level 4 - Final outcomes
    { id: "Offer", label: "Offer Extended" },
    { id: "Rejected Final", label: "Rejected" },
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setLinks([
        // Level 0 -> Level 1
        { source: "Total Applicants", target: "Pending", value: 30 },
        { source: "Total Applicants", target: "First Round", value: 40 },
        { source: "Total Applicants", target: "Rejected Initial", value: 30 },

        // Level 1 -> Level 2
        { source: "First Round", target: "Second Round", value: 20 },
        { source: "First Round", target: "Rejected First", value: 20 },

        // Level 2 -> Level 3
        { source: "Second Round", target: "Final Round", value: 8 },
        { source: "Second Round", target: "Rejected Second", value: 12 },
        // Level 3 -> Level 4
        { source: "Final Round", target: "Offer", value: 2 },
        { source: "Final Round", target: "Rejected Final", value: 6 },
      ])

      // Show arrow after links update
      setTimeout(() => setShowArrow(true), 500)
      
      // Show offer text after arrow
      setTimeout(() => setShowOffer(true), 1000)
     
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Combine nodes and links for the Sankey diagram
  const data = { nodes, links }

  return (
    <div className="relative w-full h-full">
      <AnimatePresence>
        {showArrow && (
          <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="absolute top-[-20px] right-[20px] w-28 h-28"
          >
            <DotLottieReact
              src="/assets/swirling_arrow_yellow.lottie"
              autoplay
              speed={1}
              onError={(error) => {
                console.error('Lottie Error:', error);
              }}
              onLoad={() => {
                console.log('Lottie loaded successfully');
              }}
              style={{ 
                width: '100%', 
                height: '100%',
                transform: 'rotate(-180deg)' 
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOffer && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-[-40px] right-[30px] text-2xl text-[#FECB4D] font-bold"
            style={{ fontFamily: 'Caveat' }}
          >
            You have an offer!
          </motion.div>
        )}
      </AnimatePresence>

      <ResponsiveSankey
        linkBlendMode="exclusion"
        data={data}
        margin={{ top: 40, right: 100, bottom: 40, left: 100}}
        align="center"
        colors={{ scheme: "category10" }}
        nodeOpacity={1}
        nodeHoverOpacity={1}
        theme={{
          text: {
            fill: "#ffffff"
          },
          tooltip: {
            container: {
              background: "#1e293b",
              color: "#ffffff",
            },
          },
        }}
        nodeThickness={18}
        nodeSpacing={24}
        nodeBorderWidth={0}
        nodeBorderColor={{ from: "color", modifiers: [["brighter", 0.8]] }}
        linkOpacity={0.5}
        linkHoverOpacity={0.8}
        linkContract={3}
        enableLinkGradient={true}
        labelPosition="outside"
        labelOrientation="horizontal"
        labelPadding={16}
        labelTextColor={{ from: "color", modifiers: [["brighter", 1]] }}
        animate={true}
        motionConfig="gentle"
        layout="horizontal"
        nodeTooltip={({ node }) => (
          <div className="rounded-lg border bg-background p-2 shadow-sm">
            <div className="font-bold">{node.label}</div>
          </div>
        )}
        linkTooltip={({ link }) => (
          <div className="rounded-lg border bg-background p-2 shadow-sm">
            <div className="font-bold">
              {link.source.label} → {link.target.label}: {link.value} applications
            </div>
          </div>
        )}
      />
    </div>
  )
}
