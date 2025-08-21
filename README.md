# Getting started

## Prerequisites
- Node.js (v20.0 or later)
    - If you don't have Node.js, you can download here: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

## Installation
1. Clone the repository from [Here](https://github.com/shagunmistry/FlowCraft)
2. Navigate to the project directory
3. Install the dependencies using npm
```bash
npm install
```
4. Create a `.env` file in the root directory and add the following environment variables:
```bash
SUPABASE_PRIVATE_KEY
SUPABASE_URL
FLOWCRAFT_API_URL
NEXT_PUBLIC_ROOT_DOMAIN
```
5. Run the development server:
```bash
npm run dev
```
    - If you are running the API locally, run this:
        ```bash
        npm run dev:local
        ```
6. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the website.

# Test Prompts
For Illustrations:

"A cozy cottage in an enchanted forest with a winding path, mushrooms, and magical creatures peeking from behind trees"
"A futuristic cityscape with flying vehicles and holographic billboards at sunset"
"A whimsical underwater scene showing a mermaid's tea party with sea creatures as guests"
"A serene Japanese garden with a koi pond, stone lanterns, and cherry blossoms"
"An astronaut floating in space with Earth reflected in their helmet visor"

For Infographics:

"The journey of coffee from bean to cup, showing the harvesting, processing, roasting, and brewing stages"
"Global renewable energy adoption rates by country over the past decade"
"The human sleep cycle explained, showing different sleep stages and their benefits"
"Comparison of electric, hybrid, and gas vehicles' environmental impact and cost over 10 years"
"The water cycle process illustrated with data on global water distribution"

### Diagrams Test Prompts


1. **Architecture**:
   "Create an architecture diagram for a cloud-based microservices application showing frontend, API gateway, services, databases, and third-party integrations."

2. **Block Diagram**:
   "Design a block diagram showing the components of a smart home system, including sensors, control hub, user interfaces, and connected devices."

3. **C4 Diagram**:
   "Generate a C4 context diagram for an e-commerce platform showing system boundaries, users, and external systems it interacts with."

4. **Class Diagram**:
   "Create a UML class diagram for a library management system with Book, User, Librarian, and Loan classes with their attributes and relationships."

5. **Entity Relationship Diagram**:
   "Design an ER diagram for a hospital database showing patients, doctors, appointments, medical records, and billing entities."

6. **Flowchart**:
   "Create a flowchart for a customer support ticket resolution process from initial submission to final resolution."

7. **Gantt**:
   "Generate a Gantt chart for a 3-month website redesign project showing design, development, testing, and deployment phases."

8. **Git Graph**:
   "Design a Git graph showing feature branch development, merges to develop branch, and final release to main branch."

9. **Kanban**:
   "Create a Kanban board with To Do, In Progress, Review, and Done columns for tracking development tasks for a mobile app."

10. **Mindmaps**:
    "Design a mindmap for planning a marketing campaign with branches for target audience, channels, content types, budget, and timeline."

11. **Packet**:
    "Create a network packet diagram showing the structure of an HTTPS request packet with headers, payload, and encryption details."

12. **Pie Chart**:
    "Generate a pie chart showing company revenue distribution across five product categories: Hardware (40%), Software (30%), Services (15%), Support (10%), and Training (5%)."

13. **Quadrant Chart**:
    "Design a quadrant chart plotting our product features by development effort (x-axis) and customer value (y-axis)."

14. **Radar**:
    "Create a radar chart comparing three smartphone models across six metrics: battery life, camera quality, processing power, display, price, and durability."

15. **Requirement Diagram**:
    "Generate a requirement diagram for a new payment processing system showing functional, non-functional, and security requirements with their relationships."

16. **Sankey**:
    "Design a Sankey diagram showing energy flow through a manufacturing process from input sources through various processes to outputs and waste."

17. **Sequence Diagram**:
    "Create a sequence diagram for a user authentication process showing interactions between user, frontend, auth service, and database."

18. **State Diagram**:
    "Generate a state diagram for an order processing system showing states from order creation through payment, fulfillment, shipping, and delivery."

19. **Timeline**:
    "Create a timeline of our company's major milestones from founding to present day, highlighting product launches, funding rounds, and expansion events."

20. **User Journey**:
    "Design a user journey map for a first-time customer discovering our product online, signing up for a trial, converting to paid, and becoming a regular user."

21. **XY Chart**:
    "Generate an XY scatter plot showing the correlation between marketing spend (x-axis) and new customer acquisition (y-axis) for our last 12 campaigns."

22. **ZenUML**:
    "Create a ZenUML sequence diagram for a checkout process showing interactions between customer, cart, payment processor, and inventory system."

# AWS SES
## Configuration
To test the validity of the SMPT endpoint, you can use the following command:
```bash
openssl s_client -crlf -quiet -starttls smtp -connect email-smtp.us-east-1.amazonaws.com:587
```
