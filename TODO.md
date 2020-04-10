## TODO for r0b0p

- add break/continue lol
- change id 'ref' to 'name' cause that is nicer
- control flow analysis
- id is declared but never used
- unreachable code
- go through and check spacing issues (idrest)
- change str to exp in index for print
- clean up try catch in assignment in analyzer change function to return bool

optional future additions:

- add classes
- add kwargs
- make functions starting w capital letter also readonly

List of semantic checks to keep in mind:

- number of arguments = number of parameters
- scope rules
- public/private rules

LIST OF QUESTIONS/problems for toal:

3. should we be defining string interpolation NOWWWW at this moment in time right now????
   Yes
   AST
   need to make Text more complicated
   Needs to work into the Ohm grammar
4. what other semantic checks should we add?
5. how do we make something a warning but not an error? i.e. id is declared but never used, unreachable code
