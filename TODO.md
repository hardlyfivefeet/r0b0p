## TODO for r0b0p

stars for difficulty

- add break/continue lol\*\* Maddie
- clean up try catch in assignment in analyzer change function to return bool\* Adriana
- string interpolation SEMANTICS -together-
- unreachable code -together-
- id is declared but never used -together-
- control flow analysis -together-
- rename string interpolation stuff to quasis and whatever the other mysterious word is

static semantic checks/tests to do:

- once break is added, make sure you can't use break outside of a loop \*\*Maddie
- variable declared inside function, can't be used outside
  - also check that if variable can't be found in child context, check if declared in parent context
- come up with a static semantic check \*\*\* adriana

things to remember:

- for string interpolation, the indices will be thrown off when the first thing is interpolated. be sure to figure that out, future selves

optional future additions:

- add classes
- add kwargs
- make functions starting w capital letter also readonly

LIST OF QUESTIONS/problems for toal:

4. what other semantic checks should we add?
5. how do we make something a warning but not an error? i.e. id is declared but never used, unreachable code
