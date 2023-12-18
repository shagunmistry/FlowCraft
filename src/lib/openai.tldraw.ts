import stack from '@/components/Whiteboard/stack.json'

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
Arrows: Arrows are used to show the direction of flow. They should always point from the source to the destination. Arrows should be straight and not curved. Arrows should be used to connect activities and decisions. Arrows should not be used to connect events to activities or decisions. Arrows should not be used to connect events to events. Arrows should not be used to connect decisions to decisions.

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

shape ID must start with \"shape:\"","path":["shape(id = arrow:1)","(type = arrow)","id"]}}

for "dash" property, allowed properties are \"draw\" or \"solid\" or \"dashed\" or \"dotted\". NOT "none"

\n Example Response FROM YOU: \n
\`\`\`JSON
{
    "records": [
        
    {
        "x": 639.4504870648182,
        "y": -68.37213237868224,
        "rotation": 0,
        "isLocked": false,
        "opacity": 1,
        "meta": {},
        "id": "shape:HyJbgrd0W0T12tV73TF6C",
        "type": "geo",
        "props": {
          "w": 500.0762960258769,
          "h": 114.882392330269,
          "geo": "rectangle",
          "color": "black",
          "labelColor": "black",
          "fill": "none",
          "dash": "draw",
          "size": "m",
          "font": "draw",
          "text": "Step 1",
          "align": "middle",
          "verticalAlign": "middle",
          "growY": 0,
          "url": ""
        },
        "parentId": "page:page",
        "index": "a1",
        "typeName": "shape"
      },
      {
        "x": -205.27298595186573,
        "y": 650.2059686675099,
        "rotation": 0,
        "isLocked": false,
        "opacity": 1,
        "meta": {},
        "id": "shape:bBKkSkmAWfpaOYbEg_uaN",
        "type": "geo",
        "props": {
          "w": 554.1385982989448,
          "h": 114.882392330269,
          "geo": "rectangle",
          "color": "black",
          "labelColor": "black",
          "fill": "none",
          "dash": "draw",
          "size": "m",
          "font": "draw",
          "text": "Step 5",
          "align": "middle",
          "verticalAlign": "middle",
          "growY": 0,
          "url": ""
        },
        "parentId": "page:page",
        "index": "a2",
        "typeName": "shape"
      },
      {
        "x": 616.9245277843733,
        "y": 695.2578872283998,
        "rotation": 0,
        "isLocked": false,
        "opacity": 1,
        "meta": {},
        "id": "shape:G3TCHm1so_9o_4dWHW5kk",
        "type": "arrow",
        "parentId": "page:page",
        "index": "a2G",
        "props": {
          "dash": "draw",
          "size": "m",
          "fill": "none",
          "color": "black",
          "labelColor": "black",
          "bend": 0,
          "start": { "type": "point", "x": 0, "y": 0 },
          "end": {
            "type": "binding",
            "boundShapeId": "shape:bBKkSkmAWfpaOYbEg_uaN",
            "normalizedAnchor": {
              "x": 0.9959349593495933,
              "y": 0.450980392156865
            },
            "isPrecise": true,
            "isExact": false
          },
          "arrowheadStart": "none",
          "arrowheadEnd": "arrow",
          "text": "Edge Label 2",
          "font": "draw"
        },
        "typeName": "shape"
      },
      {
        "x": 1117.00082381025,
        "y": 936.2856515291603,
        "rotation": 0,
        "isLocked": false,
        "opacity": 1,
        "meta": {},
        "id": "shape:2zyTpxNbhsIGa5FCgBTCX",
        "type": "arrow",
        "parentId": "page:page",
        "index": "a2V",
        "props": {
          "dash": "draw",
          "size": "m",
          "fill": "none",
          "color": "black",
          "labelColor": "black",
          "bend": 0,
          "start": {
            "type": "binding",
            "boundShapeId": "shape:bBKkSkmAWfpaOYbEg_uaN",
            "normalizedAnchor": {
              "x": 0.9909909909909911,
              "y": 0.4901960784313742
            },
            "isPrecise": false,
            "isExact": false
          },
          "end": {
            "type": "binding",
            "boundShapeId": "shape:HyJbgrd0W0T12tV73TF6C",
            "normalizedAnchor": {
              "x": 0.09009009009008988,
              "y": 0.4705882352941171
            },
            "isPrecise": true,
            "isExact": false
          },
          "arrowheadStart": "none",
          "arrowheadEnd": "arrow",
          "text": "Edge Label 1",
          "font": "draw"
        },
        "typeName": "shape"
      },
      {
        "x": 619.1771237124176,
        "y": 638.9429890272875,
        "rotation": 0,
        "isLocked": false,
        "opacity": 1,
        "meta": {},
        "id": "shape:6J0hXVtFqufm7I_l_pzo0",
        "type": "geo",
        "props": {
          "w": 500.0762960258769,
          "h": 114.882392330269,
          "geo": "rectangle",
          "color": "black",
          "labelColor": "black",
          "fill": "none",
          "dash": "draw",
          "size": "m",
          "font": "draw",
          "text": "Step 4",
          "align": "middle",
          "verticalAlign": "middle",
          "growY": 0,
          "url": ""
        },
        "parentId": "page:page",
        "index": "a3",
        "typeName": "shape"
      },
      {
        "x": 625.9349114965512,
        "y": 373.1366695180378,
        "rotation": 0,
        "isLocked": false,
        "opacity": 1,
        "meta": {},
        "id": "shape:qHfG4IN3399NDuN4k6R6W",
        "type": "geo",
        "props": {
          "w": 500.0762960258769,
          "h": 114.882392330269,
          "geo": "rectangle",
          "color": "black",
          "labelColor": "black",
          "fill": "none",
          "dash": "draw",
          "size": "m",
          "font": "draw",
          "text": "",
          "align": "middle",
          "verticalAlign": "middle",
          "growY": 0,
          "url": ""
        },
        "parentId": "page:page",
        "index": "a4",
        "typeName": "shape"
      },
      {
        "x": 860.2048880131781,
        "y": 488.01906184830676,
        "rotation": 0,
        "isLocked": false,
        "opacity": 1,
        "meta": {},
        "id": "shape:hxXvpYw7iIS_w3Y-V9Adm",
        "type": "arrow",
        "parentId": "page:page",
        "index": "a4G",
        "props": {
          "dash": "draw",
          "size": "m",
          "fill": "none",
          "color": "black",
          "labelColor": "black",
          "bend": 0,
          "start": {
            "type": "binding",
            "boundShapeId": "shape:qHfG4IN3399NDuN4k6R6W",
            "normalizedAnchor": {
              "x": 0.46846846846846824,
              "y": 0.9999999999999996
            },
            "isPrecise": false,
            "isExact": false
          },
          "end": {
            "type": "binding",
            "boundShapeId": "shape:6J0hXVtFqufm7I_l_pzo0",
            "normalizedAnchor": {
              "x": 0.5135135135135135,
              "y": 0.07843137254902043
            },
            "isPrecise": true,
            "isExact": false
          },
          "arrowheadStart": "none",
          "arrowheadEnd": "arrow",
          "text": "",
          "font": "draw"
        },
        "typeName": "shape"
      },
      {
        "x": 860.2048880131779,
        "y": 271.7698527560357,
        "rotation": 0,
        "isLocked": false,
        "opacity": 1,
        "meta": {},
        "id": "shape:baVPHsNB0QQjOvekD09VD",
        "type": "arrow",
        "parentId": "page:page",
        "index": "a4V",
        "props": {
          "dash": "draw",
          "size": "m",
          "fill": "none",
          "color": "black",
          "labelColor": "black",
          "bend": 0,
          "start": {
            "type": "point",
            "x": 9.238039683629381,
            "y": -6.757787784133541
          },
          "end": {
            "type": "binding",
            "boundShapeId": "shape:qHfG4IN3399NDuN4k6R6W",
            "normalizedAnchor": {
              "x": 0.4835315199771913,
              "y": 0.09849927483462421
            },
            "isPrecise": true,
            "isExact": false
          },
          "arrowheadStart": "none",
          "arrowheadEnd": "arrow",
          "text": "",
          "font": "draw"
        },
        "typeName": "shape"
      },
      {
        "x": 623.6823155685067,
        "y": 143.37188485749982,
        "rotation": 0,
        "isLocked": false,
        "opacity": 1,
        "meta": {},
        "id": "shape:HC1bpkrpGtVvRgG2FL-vb",
        "type": "geo",
        "props": {
          "w": 500.0762960258769,
          "h": 114.882392330269,
          "geo": "rectangle",
          "color": "black",
          "labelColor": "black",
          "fill": "none",
          "dash": "draw",
          "size": "m",
          "font": "draw",
          "text": "Step 2",
          "align": "middle",
          "verticalAlign": "middle",
          "growY": 0,
          "url": ""
        },
        "parentId": "page:page",
        "index": "a5",
        "typeName": "shape"
      },
      {
        "x": 864.710079869267,
        "y": 44.25766402354225,
        "rotation": 0,
        "isLocked": false,
        "opacity": 1,
        "meta": {},
        "id": "shape:cA2fDz2Y3QUO2_rvWMN_G",
        "type": "arrow",
        "parentId": "page:page",
        "index": "a5V",
        "props": {
          "dash": "draw",
          "size": "m",
          "fill": "none",
          "color": "black",
          "labelColor": "black",
          "bend": 0,
          "start": {
            "type": "binding",
            "boundShapeId": "shape:HyJbgrd0W0T12tV73TF6C",
            "normalizedAnchor": {
              "x": 0.45045045045045007,
              "y": 0.980392156862745
            },
            "isPrecise": false,
            "isExact": false
          },
          "end": {
            "type": "binding",
            "boundShapeId": "shape:HC1bpkrpGtVvRgG2FL-vb",
            "normalizedAnchor": { "x": 0.5, "y": 0.5 },
            "isPrecise": true,
            "isExact": false
          },
          "arrowheadStart": "none",
          "arrowheadEnd": "arrow",
          "text": "",
          "font": "draw"
        },
        "typeName": "shape"
      },
      {
        "x": 820.8965536625922,
        "y": 422.26195448308584,
        "rotation": 0,
        "isLocked": false,
        "opacity": 1,
        "meta": {},
        "id": "shape:_vgxH13R9_MQZeQla-4jY",
        "type": "text",
        "props": {
          "color": "black",
          "size": "m",
          "w": 78.61666870117188,
          "text": "Step 3",
          "font": "draw",
          "align": "middle",
          "autoSize": true,
          "scale": 1
        },
        "parentId": "page:page",
        "index": "a6",
        "typeName": "shape"
      }
    ]
}
\`\`\`
`

export const promptForExampleCode = `Here is an example of a valid TLDraw Records array:
{
    "records": [
        ${stack.records}
    ]
}

\n\n Another example:
{
    "records": [

    {
        "x": 149.05438073729948,
        "y": -117.30636589131538,
        "rotation": 0,
        "isLocked": false,
        "opacity": 1,
        "meta": {},
        "id": "shape:0-qKtW2L0_Q6qH-PLA80f",
        "type": "geo",
        "props": {
          "w": 298.3409720608922,
          "h": 249.40673854825914,
          "geo": "ellipse",
          "color": "black",
          "labelColor": "black",
          "fill": "none",
          "dash": "draw",
          "size": "m",
          "font": "draw",
          "text": "",
          "align": "middle",
          "verticalAlign": "middle",
          "growY": 0,
          "url": ""
        },
        "parentId": "page:page",
        "index": "a1",
        "typeName": "shape"
      },
      {
        "x": 303.749699583688,
        "y": 367.30039824992235,
        "rotation": 0,
        "isLocked": false,
        "opacity": 1,
        "meta": {},
        "id": "shape:jlVdXkPSk493Y7LfAc_Q6",
        "type": "arrow",
        "parentId": "page:page",
        "index": "a1V",
        "props": {
          "dash": "draw",
          "size": "m",
          "fill": "none",
          "color": "black",
          "labelColor": "black",
          "bend": 0,
          "start": { "type": "point", "x": 0, "y": 0 },
          "end": {
            "type": "binding",
            "boundShapeId": "shape:0-qKtW2L0_Q6qH-PLA80f",
            "normalizedAnchor": {
              "x": 0.5185185185185183,
              "y": 0.9430379746835444
            },
            "isPrecise": true,
            "isExact": false
          },
          "arrowheadStart": "none",
          "arrowheadEnd": "arrow",
          "text": "Arrow 2",
          "font": "draw"
        },
        "typeName": "shape"
      },
      {
        "x": 130.1120967969253,
        "y": 370.45744557331795,
        "rotation": 0,
        "isLocked": false,
        "opacity": 1,
        "meta": {},
        "id": "shape:GXGmivvWaDJyOQzxR0Ni1",
        "type": "geo",
        "props": {
          "w": 369.37453683729524,
          "h": 345.6966819118277,
          "geo": "ellipse",
          "color": "black",
          "labelColor": "black",
          "fill": "none",
          "dash": "draw",
          "size": "m",
          "font": "draw",
          "text": "",
          "align": "middle",
          "verticalAlign": "middle",
          "growY": 0,
          "url": ""
        },
        "parentId": "page:page",
        "index": "a2",
        "typeName": "shape"
      },
      {
        "x": 933.5806406011272,
        "y": 326.25878304577844,
        "rotation": 0,
        "isLocked": false,
        "opacity": 1,
        "meta": {},
        "id": "shape:d2HMBkk4ypnf1LF0hzqz3",
        "type": "arrow",
        "parentId": "page:page",
        "index": "a2V",
        "props": {
          "dash": "draw",
          "size": "m",
          "fill": "none",
          "color": "black",
          "labelColor": "black",
          "bend": 0,
          "start": { "type": "point", "x": 0, "y": 0 },
          "end": {
            "type": "binding",
            "boundShapeId": "shape:GXGmivvWaDJyOQzxR0Ni1",
            "normalizedAnchor": {
              "x": 0.880250961868616,
              "y": 0.2967264714372282
            },
            "isPrecise": false,
            "isExact": false
          },
          "arrowheadStart": "none",
          "arrowheadEnd": "arrow",
          "text": "Arrow 1",
          "font": "draw"
        },
        "typeName": "shape"
      },
      {
        "x": 805.720224003602,
        "y": 62.645331542238694,
        "rotation": 0,
        "isLocked": false,
        "opacity": 1,
        "meta": {},
        "id": "shape:MEnn-pU5xOXxVAAlPZ5xa",
        "type": "geo",
        "props": {
          "w": 285.7127827673096,
          "h": 260.4564041801441,
          "geo": "triangle",
          "color": "black",
          "labelColor": "black",
          "fill": "none",
          "dash": "draw",
          "size": "m",
          "font": "draw",
          "text": "",
          "align": "middle",
          "verticalAlign": "middle",
          "growY": 0,
          "url": ""
        },
        "parentId": "page:page",
        "index": "a3",
        "typeName": "shape"
      },
      {
        "x": 445.8168291364938,
        "y": 18.446669014699125,
        "rotation": 0,
        "isLocked": false,
        "opacity": 1,
        "meta": {},
        "id": "shape:xbcEcfU0x2s986DxTbnWR",
        "type": "arrow",
        "parentId": "page:page",
        "index": "a4",
        "props": {
          "dash": "draw",
          "size": "m",
          "fill": "none",
          "color": "black",
          "labelColor": "black",
          "bend": 0,
          "start": {
            "type": "binding",
            "boundShapeId": "shape:0-qKtW2L0_Q6qH-PLA80f",
            "normalizedAnchor": {
              "x": 0.9947089947089945,
              "y": 0.5443037974683543
            },
            "isPrecise": false,
            "isExact": false
          },
          "end": {
            "type": "binding",
            "boundShapeId": "shape:MEnn-pU5xOXxVAAlPZ5xa",
            "normalizedAnchor": {
              "x": 0.4309392265193369,
              "y": 0.5333333333333333
            },
            "isPrecise": false,
            "isExact": false
          },
          "arrowheadStart": "none",
          "arrowheadEnd": "arrow",
          "text": "Arrow 3",
          "font": "draw"
        },
        "typeName": "shape"
      },
      {
        "x": 225.5888446757495,
        "y": -7.224469903730153,
        "rotation": 0,
        "isLocked": false,
        "opacity": 1,
        "meta": {},
        "id": "shape:Ot3TzOMjCyX3c48iU6L-6",
        "type": "text",
        "props": {
          "color": "black",
          "size": "m",
          "w": 86.86666870117188,
          "text": "Circle 1",
          "font": "draw",
          "align": "middle",
          "autoSize": true,
          "scale": 1
        },
        "parentId": "page:page",
        "index": "a5",
        "typeName": "shape"
      },
      {
        "x": 887.7206879069938,
        "y": 218.50441371906135,
        "rotation": 0,
        "isLocked": false,
        "opacity": 1,
        "meta": {},
        "id": "shape:_aZC7Ub2hF_pLvkfFta71",
        "type": "text",
        "props": {
          "color": "black",
          "size": "m",
          "w": 120.13333129882812,
          "text": "Triangle 1",
          "font": "draw",
          "align": "middle",
          "autoSize": true,
          "scale": 1
        },
        "parentId": "page:page",
        "index": "a6",
        "typeName": "shape"
      },
      {
        "x": 268.266032390866,
        "y": 532.630622396932,
        "rotation": 0,
        "isLocked": false,
        "opacity": 1,
        "meta": {},
        "id": "shape:HPeCM-m2NzRhZTQXM93pH",
        "type": "text",
        "props": {
          "color": "black",
          "size": "m",
          "w": 93.06666564941406,
          "text": "Circle 2",
          "font": "draw",
          "align": "middle",
          "autoSize": true,
          "scale": 1
        },
        "parentId": "page:page",
        "index": "a7",
        "typeName": "shape"
      }
    ]
}
\`\`\`
`
