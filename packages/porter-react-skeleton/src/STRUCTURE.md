# Folder Structure

The structure follows [atomic design](https://bradfrost.com/blog/post/atomic-web-design/)
guidelines.

- atoms - the smallest unit, must be self contained and not dependant on any external modules.
  (types and configuration being the exception)
  - `Icon`, `Paragraph`, `Heading`, etc..
- molecules - must be restrained to only use atoms and minimal internal state.
  - atom composition, layout, contained animations
- organisms - full freedom to use and be anything, but generally reserved for complex state uses.
  - `Carousel`, `Modal`, `Canvas`, etc..
