export interface GuidelineSection {
  id: string
  title: string
  icon: string
  items: { title: string; content: string }[]
}

export const GUIDELINES: GuidelineSection[] = [
  {
    id: 'daily-routine',
    title: 'Daily Job Hunt Routine',
    icon: '📅',
    items: [
      {
        title: 'Morning block (30–45 min)',
        content:
          'Scan LinkedIn, Seek, ArchDaily Jobs, Dezeen Jobs, and company career pages. Save 3–5 roles that match AI, computational design, or digital fabrication. Prioritize Melbourne, Sydney, and remote-friendly firms.',
      },
      {
        title: 'Application block (60–90 min)',
        content:
          'Tailor your CV and cover letter for 1–2 roles. Reference specific projects (thesis, studio work, fabrication lab). Use keywords: parametric design, computational design, generative AI, digital fabrication, BIM.',
      },
      {
        title: 'Portfolio & visibility (30 min)',
        content:
          'Update Behance, personal website, or LinkedIn with one new image, case study paragraph, or process diagram. Firms hire people they can see — show your pipeline from concept → algorithm → fabrication.',
      },
      {
        title: 'Networking (20 min)',
        content:
          'Comment thoughtfully on posts from Hassell, Woods Bagot, FJMT, RMIT alumni, or AIA Victoria. Send 1 connection request per week with a genuine note about their work.',
      },
      {
        title: 'Evening reflection (10 min)',
        content:
          'Log applications, note what worked, plan tomorrow. Consistency beats intensity — 5 days/week is enough to build momentum.',
      },
    ],
  },
  {
    id: 'cv-portfolio',
    title: 'CV & Portfolio for AI + Fabrication',
    icon: '📁',
    items: [
      {
        title: 'Lead with your niche',
        content:
          'Headline: "Master of Architecture | Computational Design & AI | Digital Fabrication". Australian employers scan fast — your specialization must be visible in 3 seconds.',
      },
      {
        title: 'Project structure (STAR-F)',
        content:
          'Situation → Task → Action → Result → Fabrication. For each project: problem, your computational approach, tools used (Grasshopper, Python, ML model), and the physical or visual outcome. Include process GIFs.',
      },
      {
        title: 'Technical skills section',
        content:
          'Group by: Design Tools (Rhino, Revit, Blender), Computation (Grasshopper, Python, C#), AI/ML (TensorFlow, Stable Diffusion, custom scripts), Fabrication (FDM, SLA, CNC, laser), Collaboration (Git, Notion, Miro).',
      },
      {
        title: 'RMIT credibility',
        content:
          'Mention RMIT Architecture, digital fabrication lab access, thesis topic, and any exhibitions (MPavilion, NGV, Melbourne Design Week). RMIT has strong industry ties — leverage career hub and alumni network.',
      },
      {
        title: 'Portfolio platforms',
        content:
          'Personal site (Cargo, Webflow, or GitHub Pages) + Behance + LinkedIn featured section. Embed video of fabrication process. Keep PDF under 15 MB for email applications.',
      },
    ],
  },
  {
    id: 'australia-market',
    title: 'Australian Job Market Guide',
    icon: '🇦🇺',
    items: [
      {
        title: 'Target employers',
        content:
          'Tier 1: Hassell, Woods Bagot, FJMT, BVN, Cox Architecture, ARM. Tier 2: Grimshaw, Hayball, Architectus. Tech-adjacent: Autodesk AU, PropTech startups, construction tech (Felix, Assignar). Research: RMIT, Monash, CSIRO.',
      },
      {
        title: 'Role titles to search',
        content:
          'Graduate Architect, Computational Designer, Design Technology Specialist, BIM Coordinator, Digital Fabrication Technician, Design Researcher, Junior Architect (Computational), Parametric Designer.',
      },
      {
        title: 'Visa & work rights',
        content:
          'As an RMIT student, confirm work rights on your visa (usually 48 hrs/fortnight during semester). Mention full work rights availability post-graduation if applicable. Many firms hire international graduates — be upfront.',
      },
      {
        title: 'Salary expectations (2025–26)',
        content:
          'Graduate architect Melbourne: AUD 55k–65k. Computational design roles: AUD 60k–75k. Digital fabrication lab tech: AUD 55k–70k. Always research on Glassdoor AU and Seek salary insights.',
      },
      {
        title: 'Key job boards',
        content:
          'Seek.com.au, LinkedIn Jobs, ArchDaily Jobs, Dezeen Jobs, AIA Victoria job board, RMIT Career Hub, GradConnection, and direct firm career pages.',
      },
    ],
  },
  {
    id: 'interview-prep',
    title: 'Interview Preparation',
    icon: '🎯',
    items: [
      {
        title: 'Portfolio walkthrough (15 min)',
        content:
          'Prepare a 15-minute presentation of 2–3 projects. Explain design intent, computational logic, and fabrication constraints. Practice explaining AI tools without jargon — show business value.',
      },
      {
        title: 'Technical questions',
        content:
          'Expect: "How do you approach parametric design?" "Describe a fabrication challenge you solved." "How would you integrate AI into a design workflow?" Have concrete examples from thesis or studio.',
      },
      {
        title: 'Behavioural (STAR method)',
        content:
          'Prepare 5 stories: teamwork under deadline, creative problem-solving, learning a new tool quickly, handling critique, leading a fabrication experiment. Australian firms value collaboration and humility.',
      },
      {
        title: 'Questions to ask them',
        content:
          '"How does the firm use computational design in practice?" "Is there a fab lab or R&D budget?" "What does the graduate program look like?" "How do you approach sustainability + technology?"',
      },
      {
        title: 'Presentation tips',
        content:
          'Bring physical samples if possible. Dress smart-casual (Melbourne architecture culture is relaxed). Arrive 10 min early. Send thank-you email within 24 hours referencing something specific from the conversation.',
      },
    ],
  },
  {
    id: 'ai-fabrication',
    title: 'AI & Digital Fabrication Career Paths',
    icon: '🤖',
    items: [
      {
        title: 'Computational Design Specialist',
        content:
          'Work within architecture firms building custom Grasshopper/Python tools, automating documentation, and exploring generative design. High demand in Melbourne and Sydney tier-1 firms.',
      },
      {
        title: 'Digital Fabrication Lab Manager',
        content:
          'Operate and maintain 3D printers, CNC, robots at universities (RMIT, Monash) or progressive firms. Bridge between designers and machines. Requires hands-on making skills + safety certification.',
      },
      {
        title: 'AI Design Researcher',
        content:
          'R&D roles exploring ML for space planning, facade optimization, or generative form-finding. Often requires thesis-level research skills. Path: thesis → publication → industry or PhD.',
      },
      {
        title: 'BIM / Design Technology Lead',
        content:
          'Long-term path: become the person who sets digital standards for a firm. Revit + Dynamo + computational design + AI integration. Senior roles pay AUD 90k–120k+.',
      },
      {
        title: 'Entrepreneurship',
        content:
          'Start a niche studio: AI-generated custom furniture, parametric facades, or fabrication-as-a-service. Melbourne maker community (Maker Community, RMIT Fab Lab) is supportive for prototyping.',
      },
    ],
  },
]

export const CAREER_ROADMAP = [
  {
    phase: 'Now — Semester 2',
    focus: 'Foundation',
    actions: [
      'Finalize thesis direction (AI + fabrication intersection)',
      'Complete 2 portfolio projects with full process documentation',
      'Register on Seek, LinkedIn, RMIT Career Hub',
      'Attend 1 AIA or RMIT industry event per month',
    ],
  },
  {
    phase: '3–6 Months',
    focus: 'Launch',
    actions: [
      'Submit thesis + exhibit at end-of-year show',
      'Apply to 3–5 graduate programs weekly',
      'Build personal website with 3 case studies',
      'Secure 1–2 informational interviews with computational designers',
    ],
  },
  {
    phase: '6–12 Months',
    focus: 'Land & Learn',
    actions: [
      'Start graduate role or research assistant position',
      'Contribute to firm\'s computational design initiatives',
      'Publish thesis excerpt or conference paper (CAADRIA, ACADIA)',
      'Develop one signature skill (e.g., robotic fabrication or custom ML model)',
    ],
  },
  {
    phase: '1–3 Years',
    focus: 'Specialize',
    actions: [
      'Become go-to person for AI/fabrication in your team',
      'Lead a project from algorithm to built prototype',
      'Mentor junior designers / students',
      'Evaluate: senior role, specialist consultancy, or PhD',
    ],
  },
  {
    phase: '3–5 Years',
    focus: 'Lead',
    actions: [
      'Design Technology Lead or Computational Design Director',
      'Or: found niche practice / join PropTech or construction tech',
      'Speak at conferences, teach workshops',
      'Build industry network across AU and internationally',
    ],
  },
]
