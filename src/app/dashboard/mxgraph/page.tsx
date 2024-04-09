'use client'
import ChartDescriptionInput from '@/components/ChartDescriptionInput'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { useContext, useEffect, useRef } from 'react'
import { mxgraphFactory } from 'ts-mxgraph'
const { mxGraph, mxRubberband, mxClient, mxUtils, mxEvent, mxCodec } =
  mxgraphFactory({
    mxLoadResources: false,
    mxLoadStylesheets: false,
  })

export default function MxGraphPage() {
  const divGraph = useRef(null)

  const context = useContext(DiagramContext)

  const createToolbarElement = (graph: any) => {
    const toolbar = document.createElement('div')
    toolbar.className = 'toolbar'
    toolbar.style.position = 'absolute'
    toolbar.style.top = '10px'
    toolbar.style.left = '10px'
    toolbar.style.zIndex = '100'
    toolbar.style.display = 'flex'
    toolbar.style.flexDirection = 'column'

    const button = document.createElement('button')
    button.textContent = 'Zoom In'
    button.onclick = () => {
      graph.zoomIn()
    }
    toolbar.appendChild(button)

    const button2 = document.createElement('button')
    button2.textContent = 'Zoom Out'
    button2.onclick = () => {
      graph.zoomOut()
    }
    toolbar.appendChild(button2)

    return toolbar
  }

  useEffect(() => {
    if (!mxClient.isBrowserSupported()) {
      mxUtils.error('Browser is not supported!', 200, false)
    } else {
      console.log({ divGraph })
      mxEvent.disableContextMenu(divGraph.current)
      const element: Element | undefined = divGraph.current || undefined

      const graph = new mxGraph(element)
      new mxRubberband(graph)

      const parent = graph.getDefaultParent()
      graph.getModel().beginUpdate()
      createToolbarElement(graph)
      try {
        // const v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30)
        // const v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30)
        // // const e1 =
        // graph.insertEdge(parent, null, '', v1, v2)
      } finally {
        graph.getModel().endUpdate()
      }

      // Insert XML data into the graph
      const xmlData = `
      <mxGraphModel dx="1422" dy="778" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="3" value="" style="endArrow=none;dashed=1;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" parent="1" source="12" target="7" edge="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="40" y="70" as="sourcePoint" />
            <mxPoint x="720" y="70" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="22" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fillColor=#d5e8d4;strokeColor=#82b366;" parent="1" source="4" target="21" edge="1">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="40" y="180" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="4" value="1.0" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#dae8fc;strokeColor=#4E668A;fontStyle=1;labelPosition=center;verticalLabelPosition=top;align=center;verticalAlign=bottom;fontColor=#4E668A;" parent="1" vertex="1">
          <mxGeometry x="30" y="60" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="7" value="Master" style="text;html=1;strokeColor=#4E668A;fillColor=#dae8fc;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#1A1A1A;" parent="1" vertex="1">
          <mxGeometry x="820" y="60" width="90" height="20" as="geometry" />
        </mxCell>
        <mxCell id="8" value="" style="endArrow=none;dashed=1;html=1;fillColor=#f8cecc;strokeColor=#b85450;entryX=0;entryY=0.5;entryDx=0;entryDy=0;endFill=0;" parent="1" source="9" target="12" edge="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="40" y="150" as="sourcePoint" />
            <mxPoint x="600" y="122" as="targetPoint" />
            <Array as="points">
              <mxPoint x="710" y="100" />
              <mxPoint x="710" y="70" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="93" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;fillColor=#d5e8d4;strokeColor=#82b366;entryX=0;entryY=0.5;entryDx=0;entryDy=0;exitX=0.5;exitY=1;exitDx=0;exitDy=0;" parent="1" source="12" target="78" edge="1">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="730" y="180" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="9" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#f8cecc;strokeColor=#944440;" parent="1" vertex="1">
          <mxGeometry x="674" y="90" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="12" value="2.1" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#dae8fc;strokeColor=#4E668A;fontStyle=1;labelPosition=center;verticalLabelPosition=top;align=center;verticalAlign=bottom;fontColor=#4E668A;" parent="1" vertex="1">
          <mxGeometry x="720" y="60" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="13" value="" style="endArrow=none;dashed=1;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" parent="1" source="6" target="12" edge="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="50" y="70" as="sourcePoint" />
            <mxPoint x="700" y="70" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="19" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;fillColor=#f8cecc;strokeColor=#b85450;dashed=1;endArrow=none;endFill=0;" parent="1" source="6" target="9" edge="1">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="650" y="100" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="20" value="Hotfix" style="text;html=1;strokeColor=#944440;fillColor=#f8cecc;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#1A1A1A;" parent="1" vertex="1">
          <mxGeometry x="820" y="90" width="90" height="20" as="geometry" />
        </mxCell>
        <mxCell id="23" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fillColor=#d5e8d4;strokeColor=#82b366;" parent="1" source="78" target="24" edge="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="700" y="180" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="73" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=10;fontColor=#FFB570;fillColor=#e1d5e7;strokeColor=#9673a6;" parent="1" source="21" target="51" edge="1">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="90" y="190" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="172" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;fillColor=#e1d5e7;strokeColor=#9673a6;" parent="1" source="21" target="63" edge="1">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="90" y="240" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="21" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#d5e8d4;strokeColor=#688F51;" parent="1" vertex="1">
          <mxGeometry x="80" y="170" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="24" value="Nightly" style="text;html=1;strokeColor=#688F51;fillColor=#d5e8d4;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#1A1A1A;" parent="1" vertex="1">
          <mxGeometry x="820" y="170" width="90" height="20" as="geometry" />
        </mxCell>
        <mxCell id="25" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#d5e8d4;strokeColor=#688F51;" parent="1" vertex="1">
          <mxGeometry x="166.97" y="170" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="26" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fillColor=#d5e8d4;strokeColor=#82b366;" parent="1" source="21" target="25" edge="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="680" y="180" as="targetPoint" />
            <mxPoint x="110" y="180" as="sourcePoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="114" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;fillColor=#e1d5e7;strokeColor=#9673a6;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" parent="1" source="27" target="65" edge="1">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="280" y="240" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="27" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#d5e8d4;strokeColor=#688F51;" parent="1" vertex="1">
          <mxGeometry x="269.97" y="170" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="28" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fillColor=#d5e8d4;strokeColor=#82b366;" parent="1" source="25" target="27" edge="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="680" y="180" as="targetPoint" />
            <mxPoint x="240" y="180" as="sourcePoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="44" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=10;fontColor=#FFB570;fillColor=#ffe6cc;strokeColor=#d79b00;" parent="1" source="29" target="39" edge="1">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="400" y="130" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="29" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#d5e8d4;strokeColor=#688F51;" parent="1" vertex="1">
          <mxGeometry x="389.97" y="170" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="30" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fillColor=#d5e8d4;strokeColor=#82b366;" parent="1" source="27" target="29" edge="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="680" y="180" as="targetPoint" />
            <mxPoint x="370" y="180" as="sourcePoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="177" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;dashed=1;fillColor=#d5e8d4;strokeColor=#82b366;endArrow=none;endFill=0;" parent="1" source="6" target="92" edge="1">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="650" y="180" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="6" value="2.0" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#dae8fc;strokeColor=#4E668A;fontStyle=1;labelPosition=center;verticalLabelPosition=top;align=center;verticalAlign=bottom;fontColor=#4E668A;" parent="1" vertex="1">
          <mxGeometry x="640" y="60" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="35" value="" style="endArrow=none;dashed=1;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" parent="1" source="4" target="6" edge="1">
          <mxGeometry width="50" height="50" relative="1" as="geometry">
            <mxPoint x="49.9999999999917" y="70" as="sourcePoint" />
            <mxPoint x="690" y="70" as="targetPoint" />
            <Array as="points" />
          </mxGeometry>
        </mxCell>
        <mxCell id="43" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=10;fontColor=#FFB570;fillColor=#ffe6cc;strokeColor=#d79b00;" parent="1" source="36" target="6" edge="1">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="630" y="130" />
              <mxPoint x="630" y="70" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="162" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;entryX=0;entryY=0.5;entryDx=0;entryDy=0;fillColor=#ffe6cc;strokeColor=#d79b00;" parent="1" source="36" target="159" edge="1">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="530" y="150" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="36" value="RC2" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=10;labelPosition=center;verticalLabelPosition=top;align=center;verticalAlign=bottom;fillColor=#ffe6cc;strokeColor=#AB7B00;fontColor=#AB7B00;" parent="1" vertex="1">
          <mxGeometry x="520" y="120" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="41" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=10;fontColor=#FFB570;fillColor=#ffe6cc;strokeColor=#d79b00;" parent="1" source="39" target="36" edge="1">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="39" value="RC1" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=10;labelPosition=center;verticalLabelPosition=top;align=center;verticalAlign=bottom;fillColor=#ffe6cc;strokeColor=#d79b00;fontColor=#AB7B00;" parent="1" vertex="1">
          <mxGeometry x="414.65999999999997" y="120" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="42" value="Release" style="text;html=1;strokeColor=#AB7B00;fillColor=#ffe6cc;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=12;fontColor=#1A1A1A;" parent="1" vertex="1">
          <mxGeometry x="820" y="120" width="90" height="20" as="geometry" />
        </mxCell>
        <mxCell id="74" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=10;fontColor=#FFB570;fillColor=#e1d5e7;strokeColor=#9673a6;" parent="1" source="51" target="52" edge="1">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="147" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;jumpStyle=arc;jumpSize=6;" parent="1" source="51" target="69" edge="1">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="130" y="280" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="76" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=10;fontColor=#FFB570;fillColor=#e1d5e7;strokeColor=#9673a6;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" parent="1" source="52" target="27" edge="1">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="250" y="210" />
              <mxPoint x="250" y="180" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="52" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=10;fillColor=#e1d5e7;strokeColor=#654E70;" parent="1" vertex="1">
          <mxGeometry x="209.97" y="200" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="152" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;" parent="1" source="63" target="89" edge="1">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="110" y="310" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="63" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=10;fillColor=#e1d5e7;strokeColor=#654E70;" parent="1" vertex="1">
          <mxGeometry x="100" y="230" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="99" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;fillColor=#e1d5e7;strokeColor=#9673a6;" parent="1" source="65" target="71" edge="1">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="156" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;fillColor=#f5f5f5;strokeColor=#666666;" parent="1" source="65" target="91" edge="1">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="300" y="310" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="65" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=10;fillColor=#e1d5e7;strokeColor=#654E70;" parent="1" vertex="1">
          <mxGeometry x="289.97" y="230" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="118" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;" parent="1" source="69" target="88" edge="1">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="69" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=10;fontColor=#333333;fillColor=#f5f5f5;strokeColor=#4D4D4D;" parent="1" vertex="1">
          <mxGeometry x="139.97" y="270" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="100" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;fillColor=#e1d5e7;strokeColor=#9673a6;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" parent="1" source="71" target="29" edge="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="400" y="190" as="targetPoint" />
            <Array as="points">
              <mxPoint x="380" y="240" />
              <mxPoint x="380" y="180" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="71" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=10;fillColor=#e1d5e7;strokeColor=#654E70;" parent="1" vertex="1">
          <mxGeometry x="345.97" y="230" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="82" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fillColor=#d5e8d4;strokeColor=#82b366;" parent="1" source="29" target="92" edge="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="500" y="160" as="targetPoint" />
            <mxPoint x="460" y="160" as="sourcePoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="85" value="Feature team 1" style="text;html=1;strokeColor=#654E70;fillColor=#e1d5e7;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#1A1A1A;" parent="1" vertex="1">
          <mxGeometry x="820" y="200" width="90" height="20" as="geometry" />
        </mxCell>
        <mxCell id="86" value="Feature team 2" style="text;html=1;strokeColor=#654E70;fillColor=#e1d5e7;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#1A1A1A;" parent="1" vertex="1">
          <mxGeometry x="820" y="230" width="90" height="20" as="geometry" />
        </mxCell>
        <mxCell id="151" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;jumpStyle=arc;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" parent="1" source="88" target="52" edge="1">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="200" y="280" />
              <mxPoint x="200" y="210" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="88" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=10;fontColor=#333333;fillColor=#f5f5f5;strokeColor=#4D4D4D;" parent="1" vertex="1">
          <mxGeometry x="170.97" y="270" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="153" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;" parent="1" source="89" target="90" edge="1">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="89" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=10;fontColor=#333333;fillColor=#f5f5f5;strokeColor=#4D4D4D;" parent="1" vertex="1">
          <mxGeometry x="179.97" y="300" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="154" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;" parent="1" source="90" target="91" edge="1">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="90" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=10;fontColor=#333333;fillColor=#f5f5f5;strokeColor=#4D4D4D;" parent="1" vertex="1">
          <mxGeometry x="240.00000000000003" y="300" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="157" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" parent="1" source="91" target="71" edge="1">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="340" y="310" />
              <mxPoint x="340" y="240" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="91" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=10;fontColor=#333333;fillColor=#f5f5f5;strokeColor=#4D4D4D;" parent="1" vertex="1">
          <mxGeometry x="312" y="300" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="164" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;fillColor=#ffe6cc;strokeColor=#d79b00;" parent="1" source="95" target="103" edge="1">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="95" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=10;fillColor=#ffe6cc;strokeColor=#AB7B00;" parent="1" vertex="1">
          <mxGeometry x="434.66" y="140" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="102" value="Development" style="text;html=1;strokeColor=#4D4D4D;fillColor=#f5f5f5;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontColor=#1A1A1A;" parent="1" vertex="1">
          <mxGeometry x="820" y="290" width="90" height="20" as="geometry" />
        </mxCell>
        <mxCell id="108" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;fillColor=#ffe6cc;strokeColor=#d79b00;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" parent="1" source="103" target="36" edge="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="490" y="100" as="targetPoint" />
            <Array as="points">
              <mxPoint x="510" y="150" />
              <mxPoint x="510" y="130" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="103" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=10;fillColor=#ffe6cc;strokeColor=#AB7B00;" parent="1" vertex="1">
          <mxGeometry x="490" y="140" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="107" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;fillColor=#ffe6cc;strokeColor=#d79b00;" parent="1" source="39" target="95" edge="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="490" y="130" as="sourcePoint" />
            <mxPoint x="550" y="250" as="targetPoint" />
            <Array as="points">
              <mxPoint x="425" y="150" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="166" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;fillColor=#e1d5e7;strokeColor=#9673a6;" parent="1" source="92" target="165" edge="1">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="675" y="210" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="169" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;fillColor=#e1d5e7;strokeColor=#9673a6;" parent="1" source="92" target="168" edge="1">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="675" y="240" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="92" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=10;fillColor=#d5e8d4;strokeColor=#688F51;" parent="1" vertex="1">
          <mxGeometry x="664.97" y="170" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="116" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;fillColor=#e1d5e7;strokeColor=#9673a6;" parent="1" source="63" target="65" edge="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="159.97" y="260" as="sourcePoint" />
            <mxPoint x="209.97" y="260" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="125" value="Release Fixes" style="text;html=1;strokeColor=#AB7B00;fillColor=#ffe6cc;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=12;fontColor=#1A1A1A;" parent="1" vertex="1">
          <mxGeometry x="820" y="140" width="90" height="20" as="geometry" />
        </mxCell>
        <mxCell id="78" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=12;fillColor=#d5e8d4;strokeColor=#688F51;" parent="1" vertex="1">
          <mxGeometry x="750" y="170" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="146" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fillColor=#d5e8d4;strokeColor=#82b366;" parent="1" source="92" target="78" edge="1">
          <mxGeometry relative="1" as="geometry">
            <mxPoint x="760" y="160" as="targetPoint" />
            <mxPoint x="670" y="160" as="sourcePoint" />
            <Array as="points" />
          </mxGeometry>
        </mxCell>
        <mxCell id="163" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;entryX=0;entryY=0.5;entryDx=0;entryDy=0;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;fillColor=#ffe6cc;strokeColor=#d79b00;" parent="1" source="159" target="160" edge="1">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="159" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=10;fillColor=#ffe6cc;strokeColor=#AB7B00;" parent="1" vertex="1">
          <mxGeometry x="550" y="140" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="160" value="RC3" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=10;fillColor=#ffe6cc;strokeColor=#AB7B00;labelPosition=center;verticalLabelPosition=top;align=center;verticalAlign=bottom;fontColor=#AB7B00;" parent="1" vertex="1">
          <mxGeometry x="600" y="120" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="167" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;fillColor=#e1d5e7;strokeColor=#9673a6;" parent="1" source="165" target="85" edge="1">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="165" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=12;fillColor=#e1d5e7;strokeColor=#654E70;" parent="1" vertex="1">
          <mxGeometry x="695" y="200" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="170" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;fontSize=12;fontColor=#FFB570;fillColor=#e1d5e7;strokeColor=#9673a6;" parent="1" source="168" target="86" edge="1">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="174" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=none;endFill=0;dashed=1;" parent="1" source="168" target="173" edge="1">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="705" y="300" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="168" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=12;fillColor=#e1d5e7;strokeColor=#654E70;" parent="1" vertex="1">
          <mxGeometry x="695" y="230" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="51" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=10;fillColor=#e1d5e7;strokeColor=#654E70;" parent="1" vertex="1">
          <mxGeometry x="119.97" y="200" width="20" height="20" as="geometry" />
        </mxCell>
        <mxCell id="175" style="edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;endArrow=none;endFill=0;" parent="1" source="173" target="102" edge="1">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="173" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fontSize=10;fontColor=#333333;fillColor=#f5f5f5;strokeColor=#4D4D4D;" parent="1" vertex="1">
          <mxGeometry x="725" y="290" width="20" height="20" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
        `
      const doc = mxUtils.parseXml(xmlData)
      const codec = new mxCodec(doc)
      codec.decode(doc.documentElement, graph.getModel())

      // Zoom to fit
      graph.fit()
    }
  })

  return (
    <div className="bg-gray-100 sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <ChartDescriptionInput type={context.type || 'Chart'} />
        </div>
      </div>
      <div className="mx-auto max-w-7xl">
        <div
          className="graph-container ml-auto mr-auto h-screen w-11/12 rounded-xl bg-gray-100 shadow-lg"
          ref={divGraph}
          id="divGraph"
        ></div>
      </div>
    </div>
  )
}
