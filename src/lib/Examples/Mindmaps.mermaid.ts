import { prefix } from '../completions-prompt.mermaid'

export const MindmapsMermaidPrompt = `
${prefix}

# Mindmaps Syntax

'''
mindmap
Root
    A
      B
      C
'''

'''
mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid

'''

'''
mindmap
    id[I am a square]
'''

'''
mindmap
    id(I am a rounded square)
'''

'''
mindmap
    id((I am a circle))
'''

'''
mindmap
    id))I am a bang((
'''

'''
mindmap
    id)I am a cloud(
'''

'''
mindmap
    I am the default shape
'''

'''
mindmap
    Root
        A[A]
        :::urgent large
        B(B)
        C
'''

'''
mindmap
Root
    A
        B
      C
'''

'''
mindmap
    id1["\'**Root** with
a second line
Unicode works too: 🤓\'"]
      id2["\'The dog in **the** hog... a *very long text* that wraps to a new line\`"]
      id3[Regular labels still works]
'''
`
