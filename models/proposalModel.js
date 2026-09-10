import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, default: "Untitled" },
    jobPost: { type: String, default: "" },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Proposal = mongoose.model("Proposal", proposalSchema);
export default Proposal;