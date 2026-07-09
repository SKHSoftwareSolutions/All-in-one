import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

const PdfToolsIndexPage = lazy(() => import('./pages/pdf-tools/IndexPage'));
const MergePdfPage = lazy(() => import('./pages/pdf-tools/MergePdfPage'));
const SplitPdfPage = lazy(() => import('./pages/pdf-tools/SplitPdfPage'));
const CompressPdfPage = lazy(() => import('./pages/pdf-tools/CompressPdfPage'));
const PdfToWordPage = lazy(() => import('./pages/pdf-tools/PdfToWordPage'));
const WordToPdfPage = lazy(() => import('./pages/pdf-tools/WordToPdfPage'));
const ImageToPdfPage = lazy(() => import('./pages/pdf-tools/ImageToPdfPage'));

const ImageToolsIndexPage = lazy(() => import('./pages/image-tools/IndexPage'));
const CompressImagePage = lazy(() => import('./pages/image-tools/CompressImagePage'));
const ResizeImagePage = lazy(() => import('./pages/image-tools/ResizeImagePage'));
const ConvertImagePage = lazy(() => import('./pages/image-tools/ConvertImagePage'));
const CropImagePage = lazy(() => import('./pages/image-tools/CropImagePage'));

const TextToolsIndexPage = lazy(() => import('./pages/text-tools/IndexPage'));
const WordCounterPage = lazy(() => import('./pages/text-tools/WordCounterPage'));
const CaseConverterPage = lazy(() => import('./pages/text-tools/CaseConverterPage'));
const TextDiffCheckerPage = lazy(() => import('./pages/text-tools/TextDiffCheckerPage'));
const DocumentSimilarityCheckerPage = lazy(() => import('./pages/text-tools/DocumentSimilarityCheckerPage'));

const CalculatorsIndexPage = lazy(() => import('./pages/calculators/IndexPage'));
const PercentageCalculatorPage = lazy(() => import('./pages/calculators/PercentageCalculatorPage'));
const EmiLoanCalculatorPage = lazy(() => import('./pages/calculators/EmiLoanCalculatorPage'));
const AgeCalculatorPage = lazy(() => import('./pages/calculators/AgeCalculatorPage'));
const GpaCalculatorPage = lazy(() => import('./pages/calculators/GpaCalculatorPage'));

const GeneratorsIndexPage = lazy(() => import('./pages/generators/IndexPage'));
const QrCodeGeneratorPage = lazy(() => import('./pages/generators/QrCodeGeneratorPage'));
const PasswordGeneratorPage = lazy(() => import('./pages/generators/PasswordGeneratorPage'));
const InvoiceGeneratorPage = lazy(() => import('./pages/generators/InvoiceGeneratorPage'));

const appRoutes = [
  { path: '/pdf-tools/', element: <PdfToolsIndexPage /> },
  { path: '/pdf-tools/merge-pdf', element: <MergePdfPage /> },
  { path: '/pdf-tools/split-pdf', element: <SplitPdfPage /> },
  { path: '/pdf-tools/compress-pdf', element: <CompressPdfPage /> },
  { path: '/pdf-tools/pdf-to-word', element: <PdfToWordPage /> },
  { path: '/pdf-tools/word-to-pdf', element: <WordToPdfPage /> },
  { path: '/pdf-tools/image-to-pdf', element: <ImageToPdfPage /> },
  { path: '/image-tools/', element: <ImageToolsIndexPage /> },
  { path: '/image-tools/compress-image', element: <CompressImagePage /> },
  { path: '/image-tools/resize-image', element: <ResizeImagePage /> },
  { path: '/image-tools/convert-image', element: <ConvertImagePage /> },
  { path: '/image-tools/crop-image', element: <CropImagePage /> },
  { path: '/text-tools/', element: <TextToolsIndexPage /> },
  { path: '/text-tools/word-counter', element: <WordCounterPage /> },
  { path: '/text-tools/case-converter', element: <CaseConverterPage /> },
  { path: '/text-tools/text-diff-checker', element: <TextDiffCheckerPage /> },
  { path: '/text-tools/document-similarity-checker', element: <DocumentSimilarityCheckerPage /> },
  { path: '/calculators/', element: <CalculatorsIndexPage /> },
  { path: '/calculators/percentage-calculator', element: <PercentageCalculatorPage /> },
  { path: '/calculators/emi-loan-calculator', element: <EmiLoanCalculatorPage /> },
  { path: '/calculators/age-calculator', element: <AgeCalculatorPage /> },
  { path: '/calculators/gpa-calculator', element: <GpaCalculatorPage /> },
  { path: '/generators/', element: <GeneratorsIndexPage /> },
  { path: '/generators/qr-code-generator', element: <QrCodeGeneratorPage /> },
  { path: '/generators/password-generator', element: <PasswordGeneratorPage /> },
  { path: '/generators/invoice-generator', element: <InvoiceGeneratorPage /> },
];

function App() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-slate-500">Loading…</div>}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {appRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
