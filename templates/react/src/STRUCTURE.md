# Folder Structure

## [components](./components)

The `components` folder follows [atomic design](https://bradfrost.com/blog/post/atomic-web-design/)
guidelines, with a few additions:

### atoms

The smallest unit, must be self contained and not dependant on any external modules. (types and
configuration being the exception)

> `Icon`, `Paragraph`, `Heading`, etc.

### molecules

Must be restrained to only use atoms and minimal internal state.

> `Toggle`, etc.

### organisms

Generally reserved for complex state uses and must use `atoms` or `molecules`.

> `Form`, etc.

### layout

Components whose only function is taking in children and presenting them in a specific layout. Must
not use `atoms`, `molecules` or `organisms`.

> `Carousel`, `Modal`, `Tabs`, etc.

### pages

Components which are used as pages.

### unlisted

Components which do not fall into the above categories.

> `App`, global context providers, etc.

## [config](./config)

The `config` folder is to be used to define any sort of configuration for styles, components or
logic.
