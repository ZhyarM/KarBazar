export interface FAQItem {
  id: number
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: 'What do I need to provide?',
    answer: 'Please provide your brand guidelines, content, and any reference designs you like.'
  },
  {
    id: 2,
    question: 'Do you provide source files?',
    answer: 'Yes! All packages include source files in Figma or Adobe XD format.'
  },
  {
    id: 3,
    question: 'How many revisions are included?',
    answer: 'Basic: 2 revisions, Standard: 4 revisions, Premium: Unlimited revisions.'
  },
  {
    id: 4,
    question: 'Can you develop the design?',
    answer: 'Design only is included. For development, please check my other gigs or contact me for a custom offer.'
  }
]

export default faqData