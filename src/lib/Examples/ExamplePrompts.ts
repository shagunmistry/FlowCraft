import { TempMermaidDiagramType } from '@/components/Mermaid/OverviewDialog.mermaid'
import {
  chartJsAverageNewYorkWeatherReport,
  chartJsCancerRatesExampleReport,
  chartJsNetflixFinancialExampleReport,
  chartJsTeslaStockPricesExampleReport,
} from '../chart-js.code'

export const exampleFlowDiagramPrompts = [
  {
    title: 'SAMPLE: What is the house buying process?',
    description: '',
  },
  {
    title: 'SAMPLE: How do you make a peanut butter and jelly sandwich?',
    description: '',
  },
  {
    title: 'SAMPLE: How to Make a Paper Airplane',
    description: '',
  },
  {
    title:
      'SAMPLE: Explain the Patient Triaging Process from a Patient Perspective',
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

export const cloudArchitectPrompts = [
  {
    title: 'SAMPLE: Cloud Architecture Diagram for an AWS Web Application',
    description:
      'The diagram shows the architecture of a web application hosted on AWS. It includes the following components: S3 bucket, CloudFront distribution, EC2 instance, RDS database, and Route 53 DNS.',
  },
  {
    title: 'SAMPLE: Cloud Architecture Diagram for an Azure Web Application',
    description:
      'The diagram shows the architecture of a web application hosted on Azure. It includes the following components: Blob storage, CDN endpoint, Virtual machine, SQL database, and DNS zone.',
  },
  {
    title:
      'SAMPLE: Cloud Architecture Diagram for a Google Cloud Web Application',
    description:
      'The diagram shows the architecture of a web application hosted on Google Cloud. It includes the following components: Cloud storage bucket, Load balancer, Compute engine instance, Cloud SQL database, and Cloud DNS.',
  },
  {
    title:
      'SAMPLE: Cloud Architecture Diagram for a Multi-Cloud Web Application',
    description:
      'The diagram shows the architecture of a web application hosted on multiple cloud providers. It includes the following components: AWS S3 bucket, Azure Blob storage, Google Cloud storage bucket, and CloudFront distribution.',
  },
]

export const exampleMermaidDiagramPrompts: {
  [key in TempMermaidDiagramType]: { title: string; description: string }[]
} = {
  flowchart: exampleFlowDiagramPrompts,
  sequenceDiagram: [
    {
      title: 'SAMPLE: Sequence Diagram for Ordering a Pizza',
      description: '',
    },
    {
      title: 'SAMPLE: Sequence Diagram for a User Registration Process',
      description: '',
    },
    {
      title: 'SAMPLE: Sequence Diagram for a User Login Process',
      description: '',
    },
    {
      title: 'SAMPLE: Sequence Diagram for a User Logout Process',
      description: '',
    },
  ],
  classDiagram: [
    {
      title: 'SAMPLE: Class Diagram for a Library Management System',
      description: '',
    },
    {
      title: 'SAMPLE: Class Diagram for a Hospital Management System',
      description: '',
    },
    {
      title: 'SAMPLE: Class Diagram for a School Management System',
      description: '',
    },
    {
      title: 'SAMPLE: Class Diagram for a Banking System',
      description: '',
    },
  ],
  stateDiagram: [
    {
      title: 'SAMPLE: State Diagram for a Traffic Light System',
      description: '',
    },
    {
      title: 'SAMPLE: State Diagram for a Vending Machine',
      description: '',
    },
    {
      title: 'SAMPLE: State Diagram for a Traffic Light System',
      description: '',
    },
    {
      title: 'SAMPLE: State Diagram for a Vending Machine',
      description: '',
    },
  ],
  entityRelationshipDiagram: [
    {
      title:
        'SAMPLE: Entity Relationship Diagram for a Library Management System',
      description: '',
    },
    {
      title:
        'SAMPLE: Entity Relationship Diagram for a Hospital Management System',
      description: '',
    },
    {
      title:
        'SAMPLE: Entity Relationship Diagram for a School Management System',
      description: '',
    },
    {
      title: 'SAMPLE: Entity Relationship Diagram for a Banking System',
      description: '',
    },
  ],
  userJourney: [
    {
      title: 'SAMPLE: User Journey for a User Registration Process',
      description: '',
    },
    {
      title: 'SAMPLE: User Journey for a User Login Process',
      description: '',
    },
    {
      title: 'SAMPLE: User Journey for a User Logout Process',
      description: '',
    },
    {
      title: 'SAMPLE: User Journey for a User Profile Update Process',
      description: '',
    },
  ],
  gantt: [
    {
      title: 'SAMPLE: Gantt Chart for a Project Management System',
      description: '',
    },
    {
      title: 'SAMPLE: Gantt Chart for a Construction Project',
      description: '',
    },
    {
      title: 'SAMPLE: Gantt Chart for a Software Development Project',
      description: '',
    },
    {
      title: 'SAMPLE: Gantt Chart for a Marketing Campaign',
      description: '',
    },
  ],
  pieChart: [
    {
      title: 'SAMPLE: Pie Chart for a Sales Report',
      description: '',
    },
    {
      title: 'SAMPLE: Pie Chart for a Marketing Report',
      description: '',
    },
    {
      title: 'SAMPLE: Pie Chart for a Financial Report',
      description: '',
    },
    {
      title: 'SAMPLE: Pie Chart for a Traffic Report',
      description: '',
    },
  ],
  quadrantChart: [
    {
      title: 'SAMPLE: Quadrant Chart for a Sales Report',
      description: '',
    },
    {
      title: 'SAMPLE: Quadrant Chart for a Marketing Report',
      description: '',
    },
    {
      title: 'SAMPLE: Quadrant Chart for a Financial Report',
      description: '',
    },
    {
      title: 'SAMPLE: Quadrant Chart for a Traffic Report',
      description: '',
    },
  ],
  requirementDiagram: [
    {
      title: 'SAMPLE: Requirement Diagram for a Library Management System',
      description: '',
    },
    {
      title: 'SAMPLE: Requirement Diagram for a Hospital Management System',
      description: '',
    },
    {
      title: 'SAMPLE: Requirement Diagram for a School Management System',
      description: '',
    },
    {
      title: 'SAMPLE: Requirement Diagram for a Banking System',
      description: '',
    },
  ],
  gitgraph: [
    {
      title: 'SAMPLE: Gitgraph for a Software Development Project',
      description: '',
    },
    {
      title: 'SAMPLE: Gitgraph for a Marketing Campaign',
      description: '',
    },
    {
      title: 'SAMPLE: Gitgraph for a Sales Report',
      description: '',
    },
    {
      title: 'SAMPLE: Gitgraph for a Traffic Report',
      description: '',
    },
  ],
  mindmaps: [
    {
      title: 'SAMPLE: Mindmap for a Project Management System',
      description: '',
    },
    {
      title: 'SAMPLE: Mindmap for a Construction Project',
      description: '',
    },
    {
      title: 'SAMPLE: Mindmap for a Software Development Project',
      description: '',
    },
    {
      title: 'SAMPLE: Mindmap for a Marketing Campaign',
      description: '',
    },
  ],
  timeline: [
    {
      title: 'SAMPLE: Timeline for a Project Management System',
      description: '',
    },
    {
      title: 'SAMPLE: Timeline for a Construction Project',
      description: '',
    },
    {
      title: 'SAMPLE: Timeline for a Software Development Project',
      description: '',
    },
    {
      title: 'SAMPLE: Timeline for a Marketing Campaign',
      description: '',
    },
  ],
  zenuml: [
    {
      title: 'SAMPLE: ZenUML for a Software Development Project',
      description: '',
    },
    {
      title: 'SAMPLE: ZenUML for a Marketing Campaign',
      description: '',
    },
    {
      title: 'SAMPLE: ZenUML for a Sales Report',
      description: '',
    },
    {
      title: 'SAMPLE: ZenUML for a Traffic Report',
      description: '',
    },
  ],
  sankey: [
    {
      title: 'SAMPLE: Sankey Diagram for a Sales Report',
      description: '',
    },
    {
      title: 'SAMPLE: Sankey Diagram for a Marketing Report',
      description: '',
    },
    {
      title: 'SAMPLE: Sankey Diagram for a Financial Report',
      description: '',
    },
    {
      title: 'SAMPLE: Sankey Diagram for a Traffic Report',
      description: '',
    },
  ],
}
