import Proposal from "../models/proposalModel.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "Upwork Proposal Generator",
  },
});

export const generateProposal = async (req, res) => {
  const {
    jobPost,
    jobTitle = "Upwork Project",
    clientName = "",
    freelancerName = "Professional Freelancer",
    github = "",
    email = "",
    tone = "Professional",
    length = "Medium",
    proposedBudget = "",
    timeline = "",
    additionalDetails = "",
  } = req.body;

  if (!jobPost) {
    return res.status(400).json({ error: "Job post is required" });
  }

  const prompt = `You are an expert Upwork freelancer writing a WINNING proposal.

Job Post:
${jobPost}

Freelancer Details:
- Name: ${freelancerName}
- GitHub: ${github || "Not provided"}
- Email: ${email || "Available upon request"}
- Tone: ${tone}
- Length: ${length}

${proposedBudget ? `- Proposed Budget: ${proposedBudget}` : ""}
${timeline ? `- Timeline: ${timeline}` : ""}
${additionalDetails ? `- Additional Notes: ${additionalDetails}` : ""}

Write a highly personalized, SEO-optimized, professional Upwork proposal.
Include:
• Proper greeting (use "${clientName || "Hiring Manager"}")
• Show deep understanding of the project
• Highlight relevant skills and experience
• Mention GitHub/portfolio if provided
• Include proposed budget and timeline naturally
• End with strong call to action
• Sign off with the freelancer's name

Make it natural, confident, and keyword-rich from the job post.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "openrouter/free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const proposal = completion.choices[0]?.message?.content?.trim() || "";

    return res.status(200).json({
      success: true,
      proposal,
      jobTitle,
    });
  } catch (error) {
    console.error("❌ AI Error:", error);
    return res.status(500).json({
      error: "Failed to generate proposal",
      details: error.message,
    });
  }
};

export const createProposal = async (req, res) => {
  try {
    const { jobTitle, jobPost, content } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });

    const savedProposal = await Proposal.create({
      jobTitle: jobTitle || "Untitled",
      jobPost: jobPost || "",
      content,
    });

    return res.status(201).json({ success: true, proposal: savedProposal });
  } catch (error) {
    console.error("❌ Save Error:", error);
    return res.status(500).json({ error: "Failed to save proposal" });
  }
};

export const getProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, proposals });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch proposals" });
  }
};

export const deleteProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProposal = await Proposal.findByIdAndDelete(id);
    if (!deletedProposal) return res.status(404).json({ error: "Proposal not found" });

    return res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete proposal" });
  }
};