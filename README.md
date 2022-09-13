# chringel.dev

Hugo project and content of my personal website, [chringel.dev](https://chringel.dev)

## Local development

- Clone repository, install theme and dependencies

```shell
git clone https://github.com/chringel21/chringel.dev
git submodule update --init
cd theme/chringel
npm install
```

- Run Hugo

```shell
hugo server --disableFastRender
```

## Content

New post:

```shell
hugo new --kind post-bundle blog/202x/title
```

New note:

```shell
hugo new notes/`date +'%Y/%m/%d/%H%M'`.md
```

## License

- This repository is licensed under [MIT](./LICENSE)
- The [`content/`](./content/) of the published website is licensed under [CC BY 4.0](./content/LICENSE)
