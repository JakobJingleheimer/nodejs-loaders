# Nodejs Loaders

This package provides a variety of loaders to facilitate a quick and easy local
development and CI testing environment.

## Local dev

```console
--loader=nodejs-loaders/dev/tsx \
--loader=nodejs-loaders/dev/svgx \
--loader=nodejs-loaders/dev/mismatched-format
```

Sequence here **is** important (you want to correct a mismatched package format
before you try to use it, and SVGX is a form of JSX, so it needs TSX loader to
finish the job).

## CI testing

```console
--loader=nodejs-loaders/testing/css-module \
--loader=nodejs-loaders/testing/media \
--loader=nodejs-loaders/testing/text
```

Sequence here is not important.
