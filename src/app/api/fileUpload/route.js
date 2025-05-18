import { NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import fs from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    // Convert file to Buffer and save it temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempFilePath = path.join("/tmp", file.name);

    await fs.writeFile(tempFilePath, buffer);

    // Extract text from PDF
    const loader = new PDFLoader(tempFilePath);
    const docs = await loader.load();

    const extractedText = docs.map((doc) => doc.pageContent).join("\n\n");

    // Delete temporary file
    await fs.unlink(tempFilePath);

    return NextResponse.json({ text: extractedText });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
