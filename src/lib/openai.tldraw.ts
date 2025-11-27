// import stack from '@/components/Whiteboard/stack.json'
// import { recordsExampleOne, recordsExampleTwo } from './tldraw.code'

export const promptForTlDrawDiagram = `Given the following diagram description and title, your task is to generate a READABLE Flow Diagram based on the description and title. The diagram MUST be user-friendly and UNDERSTANDABLE. BE AS DESCRIPTIVE AS POSSBILE IN THE LABELS USED. Use your knowledge based on the context of the description to generate the diagram. 

\n
Arrangement

Please, no magical mystery tours around any diagram. We want clear direction.
Things that are dependent and connected should be clustered together.
Spacing is also helpful. Adding a little more space or a border can help separate different sections of any diagram.

Size

Size is a tremendously powerful indicator. Steps or processes that are essential should have bigger graphics. The eye will naturally be drawn here first. Size can be a pointer to importance. Items of equal stature should have similarly sized graphics. 

Shapes
Use the right shapes for the right things. Use circles for events, rectangles for activities, diamonds for decisions, and arrows for flows.

Connectors
Arrows: Arrows are used to show the direction of flow. They should always point from the source to the destination. Arrows should be straight and not curved. Arrows should be used to connect activities and decisions. Arrows should have labels that describe the flow.

Colors
Colors Allowed:  \"black\" or \"grey\" or \"light-violet\" or \"violet\" or \"blue\" or \"light-blue\" or \"yellow\" or \"orange\" or \"green\" or \"light-green\" or \"light-red\" or \"red\"
\n\n`

export const promptForTlDrawContext = (context: string) => {
  return `TlDraw Context: \n ${context}`
}

export const promptForUserMessageForTlDraw = (
  diagramTitle: string,
  diagramDescription: string,
) => {
  return `${promptForTlDrawDiagram}  \n\nDiagram Title: ${diagramTitle}\nDiagram Description: ${diagramDescription}
  \n PLEASE RESPOND ONLY IN JSON INCLUDING A VALID RECORDS ARRAY.`
}

export const promptForResponse = `The response MUST ONLY be in JSON that includes valid TLDRAW Records array. Remember to position the edges and nodes so that it is in a readable view. The response will be validated and if it is not valid, you will be asked to try again.

shape ID must start with \"shape:\" and then the shape id number. For example, \"shape:1\". You can not use "arrow" or any other shape id.

for "dash" property, allowed properties are \"draw\" or \"solid\" or \"dashed\" or \"dotted\". NOT "none"

for "color" property, use different colors for different shapes.

for "shape" property, use different shapes based on the context.

for "label" property, use different label texts based on the context.

\n Example Response FROM YOU: \n
\`\`\`JSON
{
    "records": []   
}
\`\`\`
`

export const promptForExampleCode = `Here is an example of a valid Whiteboard Records array:
{
    "records": 
        []
}

\n\n Another example:
{
    "records": []
}
\`\`\`
`
