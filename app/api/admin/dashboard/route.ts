import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { connectDB } from "@/lib/mongodb"
import {
  ContactClick, Post, Project, Award, Milestone, OurFamilyImage,
  LandInquiry, ContactSubmission
} from "@/lib/models"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await connectDB()

  const today = new Date().toISOString().split("T")[0]
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [allClicks, weekClicks, todayClicks, posts, projects, awards, milestones, familyImages, landInquiries, contactSubmissions] =
    await Promise.all([
      ContactClick.find({}, { type: 1 }),
      ContactClick.find({ clicked_at: { $gte: weekAgo } }, { type: 1, clicked_at: 1 }),
      ContactClick.find({ clicked_at: { $gte: `${today}T00:00:00.000Z` } }, { type: 1 }),
      Post.find({}, { is_published: 1 }),
      Project.find({}, { is_published: 1 }),
      Award.find({}, { _id: 1 }),
      Milestone.find({}, { _id: 1 }),
      OurFamilyImage.find({}, { _id: 1 }),
      LandInquiry.find({}, { _id: 1, status: 1 }),
      ContactSubmission.find({}, { _id: 1, status: 1 }),
    ])

  const last7Days: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    last7Days.push(d.toISOString().split("T")[0])
  }

  const clicksByDay = last7Days.map((date) => ({
    date,
    facebook: weekClicks.filter((c) => c.type === "facebook" && c.clicked_at?.startsWith(date)).length,
    line: weekClicks.filter((c) => c.type === "line" && c.clicked_at?.startsWith(date)).length,
    loan_contact: weekClicks.filter((c) => c.type === "loan_contact" && c.clicked_at?.startsWith(date)).length,
  }))

  return NextResponse.json({
    totalClicks: allClicks.length,
    facebookClicks: allClicks.filter((c) => c.type === "facebook").length,
    lineClicks: allClicks.filter((c) => c.type === "line").length,
    loanContactClicks: allClicks.filter((c) => c.type === "loan_contact").length,
    todayClicks: todayClicks.length,
    weekClicks: weekClicks.length,
    clicksByDay,
    publishedPosts: posts.filter((p) => p.is_published).length,
    draftPosts: posts.filter((p) => !p.is_published).length,
    publishedProjects: projects.filter((p) => p.is_published).length,
    draftProjects: projects.filter((p) => !p.is_published).length,
    awardsCount: awards.length,
    milestonesCount: milestones.length,
    familyImagesCount: familyImages.length,
    totalLandInquiries: landInquiries.length,
    newLandInquiries: landInquiries.filter((i) => i.status === "new").length,
    totalContactSubmissions: contactSubmissions.length,
    newContactSubmissions: contactSubmissions.filter((i) => i.status === "new").length,
  })
}
