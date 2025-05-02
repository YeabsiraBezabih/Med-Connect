import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full py-4 text-left flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium">{question}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 mb-4' : 'max-h-0'
        }`}
      >
        <p className="py-2 text-gray-600">{answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "How do I create an account?",
      answer: "You can create an account by clicking the 'Register' button and filling out the required information. Make sure to read and accept our Terms of Service and Privacy Policy."
    },
    {
      question: "How do I order medicine?",
      answer: "To order medicine, you need to upload a valid prescription through your dashboard. Once uploaded, you can select a pharmacy and place your order."
    },
    {
      question: "How do pharmacies verify prescriptions?",
      answer: "Our platform allows pharmacies to view and verify digital prescriptions securely. They check the authenticity and validity of each prescription before processing orders."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept various payment methods including credit/debit cards and other digital payment options. Specific payment methods may vary by pharmacy."
    },
    {
      question: "How is my medical information protected?",
      answer: "We use industry-standard encryption and security measures to protect your medical information. Only authorized healthcare providers and pharmacies can access relevant information."
    },
    {
      question: "Can I cancel my order?",
      answer: "Yes, you can cancel your order before it is processed by the pharmacy. Once processed, you'll need to contact the pharmacy directly for cancellation options."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our customer support team through the contact form on our website or by emailing support@medconnect.com."
    },
    {
      question: "What should I do if I experience technical issues?",
      answer: "If you experience technical issues, try refreshing the page or clearing your browser cache. If the problem persists, contact our technical support team."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQ; 