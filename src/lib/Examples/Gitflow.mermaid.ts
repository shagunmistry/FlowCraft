import { prefix } from '../completions-prompt.mermaid'

export const GitflowMermaidPrompt = `
${prefix('gitgraph')}

# Gitflow Diagram Syntax
'''
---
title: Example Git diagram
---
gitGraph
   commit
   commit
   branch develop
   checkout develop
   commit
   commit
   checkout main
   merge develop
   commit
   commit
'''

'''
gitGraph
commit id: "Alpha"
commit id: "Beta"
commit id: "Gamma"
'''

'''
gitGraph
commit id: "Normal"
commit
commit id: "Reverse" type: REVERSE
commit
commit id: "Highlight" type: HIGHLIGHT
commit
'''

'''
gitGraph
commit
commit id: "Normal" tag: "v1.0.0"
commit
commit id: "Reverse" type: REVERSE tag: "RC_1"
commit
commit id: "Highlight" type: HIGHLIGHT tag: "8.8.4"
commit
'''

'''
gitGraph
commit
commit
branch develop
commit
commit
commit
'''

'''
gitGraph
commit
commit
branch develop
commit
commit
commit
checkout main
commit
commit
'''

'''
gitGraph
commit
commit
branch develop
commit
commit
commit
checkout main
commit
commit
merge develop
commit
commit
'''

'''
gitGraph
commit id: "1"
commit id: "2"
branch nice_feature
checkout nice_feature
commit id: "3"
checkout main
commit id: "4"
checkout nice_feature
branch very_nice_feature
checkout very_nice_feature
commit id: "5"
checkout main
commit id: "6"
checkout nice_feature
commit id: "7"
checkout main
merge nice_feature id: "customID" tag: "customTag" type: REVERSE
checkout very_nice_feature
commit id: "8"
checkout main
commit id: "9"
'''

'''
gitGraph
commit id: "ZERO"
branch develop
branch release
commit id:"A"
checkout main
commit id:"ONE"
checkout develop
commit id:"B"
checkout main
merge develop id:"MERGE"
commit id:"TWO"
checkout release
cherry-pick id:"MERGE" parent:"B"
commit id:"THREE"
checkout develop
commit id:"C"
'''

'''
%%{init: { 'logLevel': 'debug', 'theme': 'base', 'gitGraph': {'rotateCommitLabel': true}} }%%
gitGraph
  commit id: "feat(api): ..."
  commit id: "a"
  commit id: "b"
  commit id: "fix(client): .extra long label.."
  branch c2
  commit id: "feat(modules): ..."
  commit id: "test(client): ..."
  checkout main
  commit id: "fix(api): ..."
  commit id: "ci: ..."
  branch b1
  commit
  branch b2
  commit
'''
`
