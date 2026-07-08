# Simple Markdown and Orgmode formatting quick shortcuts
## A VS Code extension

### defaults
ctrl+s,ctrl+I: toggle Italics
ctrl+s,ctrl+b: toggle bold
ctrl+s,ctrl+backtick: toggle inline code with backticks, if spanning a single line, otherwise toggle surrounding the block with triple backticks
ctrl+s,ctrl+-: strikethrough

### optional
ctrl+s,ctrl+space: clear all formatting

### config
apply to selected text only: true/false (default: true)

### mardown specific config
preferred bold prefix/suffix: "**"
preferred italics prefix/suffix: "*"
code prefix/suffix inline: "`"
code prefix/suffix block: "```"
code prefix default language: ""
strikethrough prefix/suffix: "~~"

### orgmode specific config
preferred bold prefix/suffix: "*"
preferred italics prefix/suffix: "/"
code prefix/suffix inline: "="
code prefix/suffix block open: "#+BEGIN_SRC"
            close: "#+END_SRC"
code prefix default language: ""
strikethrough prefix/suffix: "+"
