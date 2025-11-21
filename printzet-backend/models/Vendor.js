import mongoose from "mongoose";

// Address sub-schema
const AddressSchema = new mongoose.Schema(
  {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
  { _id: false }
);

// Banking details sub-schema
const BankingDetailsSchema = new mongoose.Schema(
  {
    accountHolderName: { type: String },
    bankAccountNumber: { type: String },
    ifscCode: { type: String },
    bankName: { type: String },
  },
  { _id: false }
);

// Company info sub-schema
const CompanyInfoSchema = new mongoose.Schema(
  {
    companyRegistrationNumber: { type: String },
    gstOrTaxId: { type: String },
    panNumber: { type: String },
  },
  { _id: false }
);

const VendorSchema = new mongoose.Schema(
  {
    // Legacy/basic vendor fields (kept for backward compatibility)
    name: { type: String },
    pressName: { type: String },
    // Use Mixed to tolerate prior string/object shapes for address
    address: { type: mongoose.Schema.Types.Mixed },

    // New vendor fields
    businessName: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    websiteUrl: { type: String },

    // Auth and verification fields retained from existing model
    password: { type: String, required: true },
    serviceablePincodes: [{ type: String }],
    verificationToken: { type: String },
    isVerified: { type: Boolean, default: false },
    tokenExpiry: { type: Date },

    // Nested structures
    bankingDetails: BankingDetailsSchema,
    companyInfo: CompanyInfoSchema,
    vendorAddress: AddressSchema,
  },
  { timestamps: true }
);

// Cross-field validation: require at least one of name or businessName
VendorSchema.pre("validate", function (next) {
  if (!this.name && !this.businessName) {
    this.invalidate("businessName", "Vendor name is required");
  }
  next();
});

export default mongoose.model("Vendor", VendorSchema);
