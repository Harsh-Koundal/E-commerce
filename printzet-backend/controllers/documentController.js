import { Document } from "../models/document.model.js";

// Upload Document Controller
const uploadDocument = async (req, res) => {
  try {

    const files = req.files.map(file => ({
      url: `/uploads/documents/${file.filename}`,
      originalname: file.originalname,
    }));

    const doc = new Document({
      userId: req.user._id, // pass userId from frontend
      files
    });

    await doc.save();

    res.status(201).json({ message: 'Uploaded successfully', documentId: doc._id, files: doc.files });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error });
  }
};

// Get Document Preview Controller
const getDocumentPreview = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    res.json({ files: document.files });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch preview', error });
  }
};

// Update Print Settings Controller
const updatePrintSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const { paperType, printQuality, binding, lamination, printedSides, numCopies, colorType } = req.body;

    const doc = await Document.findById(id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    doc.settings = {
      paperType: paperType || doc.settings.paperType,
      printQuality: printQuality || doc.settings.printQuality,
      binding: binding || doc.settings.binding,
      lamination: lamination || doc.settings.lamination,
      printedSides: printedSides || doc.settings.printedSides,
      numCopies: numCopies || doc.settings.numCopies,
      colorType: colorType || doc.settings.colorType
    };

    await doc.save();

    res.status(200).json({ message: 'Settings updated', settings: doc.settings });
  } catch (err) {
    console.error('Settings update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export {
  uploadDocument,
  getDocumentPreview,
  updatePrintSettings
};
