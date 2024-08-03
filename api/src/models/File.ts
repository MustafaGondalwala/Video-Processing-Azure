import { Schema, model, Document, ObjectId } from "mongoose";

export interface IFile extends Document {
  user: ObjectId;
  container: string;
  fileName: string;
  url: string;
  eventType: string;
  contentLength: number;
  eTag: string;
  createdAt: Date;
}

const fileSchema = new Schema<IFile>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  container: { type: String, required: true },
  fileName: { type: String, required: true },
  url: { type: String, required: true },
  eventType: { type: String, required: true },
  contentLength: { type: Number, required: true },
  eTag: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const File = model<IFile>("File", fileSchema);

export default File;
