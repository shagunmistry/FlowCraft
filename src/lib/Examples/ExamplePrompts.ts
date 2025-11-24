import { TempMermaidDiagramType } from '@/components/Mermaid/OverviewDialog.mermaid'
import {
  chartJsAverageNewYorkWeatherReport,
  chartJsCancerRatesExampleReport,
  chartJsNetflixFinancialExampleReport,
  chartJsTeslaStockPricesExampleReport,
} from '../chart-js.code'

export const exampleFlowDiagramPrompts = [
  {
    title:
      'SAMPLE: Create a flowchart showing the complete home buying process from initial search to closing',
    description: '',
  },
  {
    title:
      'SAMPLE: Design a step-by-step flowchart for making a peanut butter and jelly sandwich with decision points',
    description: '',
  },
  {
    title:
      'SAMPLE: Show me a flowchart of how to fold a paper airplane with detailed steps',
    description: '',
  },
  {
    title:
      'SAMPLE: Map out the patient triaging process in an emergency room from arrival to treatment',
    description: '',
  },
]

export const exampleChartDataPrompts = [
  {
    title: 'Average Temperature in NYC',
    description: chartJsAverageNewYorkWeatherReport,
  },
  {
    title: 'Netflix Sales Report',
    description: chartJsNetflixFinancialExampleReport,
  },
  {
    title: 'Tesla Stock Price',
    description: chartJsTeslaStockPricesExampleReport,
  },
  {
    title: 'Annual Cancer Rates',
    description: chartJsCancerRatesExampleReport,
  },
]

export const exampleWhiteboardPrompts = [
  {
    title: 'Brainstorming Session',
    description: '',
  },
  {
    title: 'Collaborative Design Session',
    description: '',
  },
  {
    title: 'Team Meeting Notes',
    description: '',
  },
  {
    title: 'Project Planning Session',
    description: '',
  },
]

export const exampleMermaidDiagramPrompts: {
  [key in TempMermaidDiagramType]: { title: string; description: string }[]
} = {
  flowchart: exampleFlowDiagramPrompts,
  sequenceDiagram: [
    {
      title:
        'SAMPLE: Create a sequence diagram showing the interactions between customer, website, and kitchen when ordering a pizza online',
      description: '',
    },
    {
      title:
        'SAMPLE: Design a sequence diagram for user registration with email verification and database storage',
      description: '',
    },
    {
      title:
        'SAMPLE: Show the authentication flow sequence diagram including token generation and validation',
      description: '',
    },
    {
      title:
        'SAMPLE: Map out a user logout sequence with session cleanup and redirect processes',
      description: '',
    },
  ],
  classDiagram: [
    {
      title:
        'SAMPLE: Design a class diagram for a library system with books, members, loans, and staff relationships',
      description: '',
    },
    {
      title:
        'SAMPLE: Create a class diagram showing patient, doctor, appointment, and medical record structures in a hospital',
      description: '',
    },
    {
      title:
        'SAMPLE: Build a class diagram for a school with students, teachers, courses, and grade management',
      description: '',
    },
    {
      title:
        'SAMPLE: Design a banking system class diagram with accounts, transactions, customers, and branches',
      description: '',
    },
  ],
  stateDiagram: [
    {
      title:
        'SAMPLE: Show a state diagram for a traffic light system with timing transitions between red, yellow, and green',
      description: '',
    },
    {
      title:
        'SAMPLE: Create a state diagram for a vending machine including payment, selection, and dispensing states',
      description: '',
    },
    {
      title:
        'SAMPLE: Design a state diagram for an order processing system from pending to delivered',
      description: '',
    },
    {
      title:
        'SAMPLE: Map out a user account state diagram showing active, suspended, and deleted states with transitions',
      description: '',
    },
  ],
  entityRelationshipDiagram: [
    {
      title:
        'SAMPLE: Design an ER diagram for a library database showing relationships between books, authors, members, and loans',
      description: '',
    },
    {
      title:
        'SAMPLE: Create an ER diagram for a hospital database with patients, doctors, appointments, and prescriptions',
      description: '',
    },
    {
      title:
        'SAMPLE: Build an ER diagram for a school database including students, teachers, courses, enrollments, and grades',
      description: '',
    },
    {
      title:
        'SAMPLE: Show an ER diagram for a banking system with customers, accounts, transactions, and branches',
      description: '',
    },
  ],
  userJourney: [
    {
      title:
        'SAMPLE: Map the user journey for signing up for a new service from landing page to first login',
      description: '',
    },
    {
      title:
        'SAMPLE: Create a user journey diagram for the login experience including errors and password reset',
      description: '',
    },
    {
      title:
        'SAMPLE: Show the user journey for logging out and clearing session data across devices',
      description: '',
    },
    {
      title:
        'SAMPLE: Design a user journey for updating profile information with validation and confirmation steps',
      description: '',
    },
  ],
  gantt: [
    {
      title:
        'SAMPLE: Create a Gantt chart for a web development project with design, development, testing, and deployment phases',
      description: '',
    },
    {
      title:
        'SAMPLE: Design a Gantt chart for a construction project showing foundation, framing, electrical, and finishing work',
      description: '',
    },
    {
      title:
        'SAMPLE: Build a Gantt chart for a software release with sprints, QA testing, and deployment milestones',
      description: '',
    },
    {
      title:
        'SAMPLE: Show a Gantt chart for a marketing campaign with content creation, ad launches, and performance tracking',
      description: '',
    },
  ],
  pieChart: [
    {
      title:
        'SAMPLE: Create a pie chart showing quarterly sales distribution across different product categories',
      description: '',
    },
    {
      title:
        'SAMPLE: Design a pie chart displaying marketing budget allocation across digital, print, and events',
      description: '',
    },
    {
      title:
        'SAMPLE: Show a pie chart of annual expenses broken down by department or cost center',
      description: '',
    },
    {
      title:
        'SAMPLE: Build a pie chart illustrating website traffic sources from organic, paid, social, and referral',
      description: '',
    },
  ],
  quadrantChart: [
    {
      title:
        'SAMPLE: Create a priority matrix quadrant chart for project tasks based on urgency and importance',
      description: '',
    },
    {
      title:
        'SAMPLE: Design a product portfolio quadrant chart showing market share vs growth rate',
      description: '',
    },
    {
      title:
        'SAMPLE: Build a risk assessment quadrant chart plotting likelihood vs impact of business risks',
      description: '',
    },
    {
      title:
        'SAMPLE: Show a feature prioritization quadrant chart based on user value and implementation effort',
      description: '',
    },
  ],
  requirementDiagram: [
    {
      title:
        'SAMPLE: Create a requirements diagram for a library system showing functional and performance requirements',
      description: '',
    },
    {
      title:
        'SAMPLE: Design a requirements diagram for hospital software with security, compliance, and usability needs',
      description: '',
    },
    {
      title:
        'SAMPLE: Build a requirements diagram for a school management portal with student, teacher, and admin requirements',
      description: '',
    },
    {
      title:
        'SAMPLE: Show a requirements diagram for a banking app including security, transaction, and reporting requirements',
      description: '',
    },
  ],
  gitgraph: [
    {
      title:
        'SAMPLE: Visualize a Git workflow with feature branches, merges, and releases for a software project',
      description: '',
    },
    {
      title:
        'SAMPLE: Create a Git graph showing the branching strategy for a marketing website with staging and production',
      description: '',
    },
    {
      title:
        'SAMPLE: Design a Git graph illustrating hotfix and release branches for a SaaS application',
      description: '',
    },
    {
      title:
        'SAMPLE: Show a Git workflow with multiple developers working on parallel features with merge conflicts',
      description: '',
    },
  ],
  mindmaps: [
    {
      title:
        'SAMPLE: Create a mindmap for planning a software project with features, resources, and timeline branches',
      description: '',
    },
    {
      title:
        'SAMPLE: Design a mindmap for a construction project showing phases, materials, teams, and dependencies',
      description: '',
    },
    {
      title:
        'SAMPLE: Build a mindmap for product development including research, design, engineering, and marketing',
      description: '',
    },
    {
      title:
        'SAMPLE: Show a mindmap for a marketing campaign with channels, content types, metrics, and audience segments',
      description: '',
    },
  ],
  timeline: [
    {
      title:
        'SAMPLE: Create a timeline of major milestones in a product launch from concept to market release',
      description: '',
    },
    {
      title:
        'SAMPLE: Design a timeline showing the phases of a building construction project over 18 months',
      description: '',
    },
    {
      title:
        'SAMPLE: Build a timeline for a software development cycle including sprints, releases, and major features',
      description: '',
    },
    {
      title:
        'SAMPLE: Show a timeline of a marketing campaign with content drops, ad launches, and performance reviews',
      description: '',
    },
  ],
  zenuml: [
    {
      title:
        'SAMPLE: Create a ZenUML sequence diagram for an API authentication and data retrieval flow',
      description: '',
    },
    {
      title:
        'SAMPLE: Design a ZenUML diagram showing the interaction flow for a payment processing system',
      description: '',
    },
    {
      title:
        'SAMPLE: Build a ZenUML diagram for a microservices architecture with service-to-service communication',
      description: '',
    },
    {
      title:
        'SAMPLE: Show a ZenUML sequence for a user registration process with validation and confirmation emails',
      description: '',
    },
  ],
  sankey: [
    {
      title:
        'SAMPLE: Create a Sankey diagram showing sales funnel flow from leads to conversions by channel',
      description: '',
    },
    {
      title:
        'SAMPLE: Design a Sankey diagram illustrating energy flow in a manufacturing process from input to output',
      description: '',
    },
    {
      title:
        'SAMPLE: Build a Sankey diagram showing budget allocation flow from departments to specific initiatives',
      description: '',
    },
    {
      title:
        'SAMPLE: Show a Sankey diagram of website traffic flow from sources through pages to conversions',
      description: '',
    },
  ],
  treemap: [
    {
      title:
        'SAMPLE: Create a treemap showing file system storage usage broken down by folder and file size',
      description: '',
    },
    {
      title:
        'SAMPLE: Design a treemap visualizing annual budget distribution across departments and sub-categories',
      description: '',
    },
    {
      title:
        'SAMPLE: Build a treemap displaying market share of tech companies by revenue and product lines',
      description: '',
    },
    {
      title:
        'SAMPLE: Show a treemap of website traffic by source, medium, and landing page with proportional sizing',
      description: '',
    },
  ],
}
