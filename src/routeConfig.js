export const categoryRoutes = [
  {
    path: '/pdf-tools/',
    title: 'PDF Tools',
    description: 'Merge, split, compress, convert, and transform PDF documents.',
    tools: [
      { path: '/pdf-tools/merge-pdf', label: 'Merge PDF', description: 'Combine multiple PDFs into one document.' },
      { path: '/pdf-tools/split-pdf', label: 'Split PDF', description: 'Break a PDF into smaller files.' },
      { path: '/pdf-tools/compress-pdf', label: 'Compress PDF', description: 'Reduce file size with less effort.' },
      { path: '/pdf-tools/pdf-to-word', label: 'PDF to Word', description: 'Convert documents into editable Word files.' },
      { path: '/pdf-tools/word-to-pdf', label: 'Word to PDF', description: 'Turn Word files into PDF format.' },
      { path: '/pdf-tools/image-to-pdf', label: 'Image to PDF', description: 'Create PDFs from image files.' },
    ],
  },
  {
    path: '/image-tools/',
    title: 'Image Tools',
    description: 'Resize, crop, compress, and convert common image formats.',
    tools: [
      { path: '/image-tools/compress-image', label: 'Compress Image', description: 'Shrink image files for faster sharing.' },
      { path: '/image-tools/resize-image', label: 'Resize Image', description: 'Change the dimensions of an image.' },
      { path: '/image-tools/convert-image', label: 'Convert Image', description: 'Switch between image file formats.' },
      { path: '/image-tools/crop-image', label: 'Crop Image', description: 'Trim an image to a specific area.' },
    ],
  },
  {
    path: '/text-tools/',
    title: 'Text Tools',
    description: 'Count words, compare text, and transform content formats.',
    tools: [
      { path: '/text-tools/word-counter', label: 'Word Counter', description: 'Count words and characters quickly.' },
      { path: '/text-tools/case-converter', label: 'Case Converter', description: 'Change text casing with one click.' },
      { path: '/text-tools/text-diff-checker', label: 'Text Diff Checker', description: 'Highlight changes between two texts.' },
      { path: '/text-tools/document-similarity-checker', label: 'Document Similarity Checker', description: 'Compare text documents for overlap.' },
    ],
  },
  {
    path: '/calculators/',
    title: 'Calculators',
    description: 'Use simple calculators for percentages, loans, age, and GPA.',
    tools: [
      { path: '/calculators/percentage-calculator', label: 'Percentage Calculator', description: 'Calculate percentages and ratios.' },
      { path: '/calculators/emi-loan-calculator', label: 'EMI Loan Calculator', description: 'Estimate monthly loan payments.' },
      { path: '/calculators/age-calculator', label: 'Age Calculator', description: 'Find ages and date differences.' },
      { path: '/calculators/gpa-calculator', label: 'GPA Calculator', description: 'Estimate academic GPA values.' },
    ],
  },
  {
    path: '/generators/',
    title: 'Generators',
    description: 'Generate QR codes, passwords, and invoices instantly.',
    tools: [
      { path: '/generators/qr-code-generator', label: 'QR Code Generator', description: 'Create shareable QR codes.' },
      { path: '/generators/password-generator', label: 'Password Generator', description: 'Generate secure, random passwords.' },
      { path: '/generators/invoice-generator', label: 'Invoice Generator', description: 'Create simple invoices with ease.' },
    ],
  },
];

export const toolRoutes = categoryRoutes.flatMap((category) =>
  category.tools.map((tool) => ({
    path: tool.path,
    title: tool.label,
    description: tool.description,
  }))
);
