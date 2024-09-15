# Nodejs Loaders

<img src="./logo.svg" height="100" width="100" alt="" />

This package provides a variety of loaders to facilitate a quick and easy CI testing environment.

> [!WARNING]
> These should NOT be used in production; they will likely not do what you need there anyway.

```console
node
# sequence here IS important:
  --loader=@nodejs-loaders/alias \
  --loader=@nodejs-loaders/tsx \
  --loader=@nodejs-loaders/svgx \
# sequence here is NOT important:
  --loader=@nodejs-loaders/css-module \
  --loader=@nodejs-loaders/media \
  --loader=@nodejs-loaders/text \
  ./main.js
```

* [Alias loader](./packages/alias/)
* [JSX / TSX loader](./packages/tsx/)
* [SVGX loader](./packages/svgx/)
* [CSS Modules loader](./packages/css-module/)
* [Media loader](./packages/media/)
* [Text loader](./packages/text/)
