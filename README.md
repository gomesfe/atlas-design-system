# Atlas — telas

O design de cada tela do portal Atlas em HTML e CSS puros, com o
[Atlas Design System](https://github.com/gomesfe/atlas-design-system).

Só design: sem framework, sem backend, sem dados de verdade. Cada arquivo em
`telas/` abre sozinho, com dois cliques, e traz o `atlas.css` embutido.

**Galeria:** abra `index.html`, que tem um cartão para cada tela.

## Telas

| Arquivo | Tela |
| --- | --- |
| `telas/home.html` | Home: escopo, boas-vindas, métricas, ações rápidas, atualizações, serviços, links, onboarding, ferramentas |
| `telas/catalogo.html` | Catálogo em tabela, com busca e filtros por dono e tag |
| `telas/catalogo-v2.html` | Catálogo em cartões, filtrado por tipo |
| `telas/meus-grupos.html` | Grupos e squads do usuário |
| `telas/apis.html` | Explorer de APIs |
| `telas/docs.html` | TechDocs |
| `telas/trilhas.html` | Trilhas de aprendizado |
| `telas/trilha-detalhe.html` | Uma trilha aberta, com as etapas |
| `telas/create.html` | Galeria dos 17 software templates, por categoria |
| `telas/break-glass.html` | Solicitação de acesso emergencial |
| `telas/api-keys.html` | Chaves de API |
| `telas/api-keys-nova-chave.html` | *Estado:* diálogo de criação de chave |
| `telas/api-keys-chave-criada.html` | *Estado:* segredo exibido uma única vez |
| `telas/admin.html` | Painel administrativo |
| `telas/buscar.html` | Busca global com resultados |
| `telas/configuracoes.html` | Configurações: aparência |
| `telas/configuracoes-identidade.html` | *Estado:* configurações, aba identidade |
| `telas/notificacoes.html` | Caixa de notificações |
| `telas/status-plataforma.html` | Status dos serviços do portal |

A navegação entre as telas funciona: pílulas da barra, botões de busca,
notificações e configurações, e links internos. O botão de sol alterna o tema
claro/escuro e guarda a escolha no navegador. É o único JavaScript das telas.

## Como editar

As fontes ficam em `src/telas/`, e cada uma tem só o miolo da tela. Dois
atalhos evitam repetir marcação:

- `{{nav:catalog}}` — a barra de navegação, com a pílula `catalog` acesa
- `{{i:busca}}` — um ícone no traço do DS (18px); `{{i:busca:14}}` muda o tamanho

Depois de editar, gere os arquivos finais:

```bash
node build.mjs
```

O build embute o `atlas.css` em cada tela e refaz `telas/` e o `index.html`.
Não edite `telas/` à mão: a próxima build sobrescreve.

## De onde vem o CSS

`atlas.css` é cópia do bloco `<style id="atlas-css">` do repositório
`atlas-design-system`, que é a fonte da verdade. Mudou o visual? Mude lá,
copie o bloco para cá e rode o build.

Esta versão inclui três ajustes feitos no design system junto com as telas:

- com a nav fixa, o miolo da página ganha o mesmo respiro de 20px que tem com a
  nav no fluxo (`.atlas-topNav--fixed + .atlas-pageMain`);
- `atlas-serviceRow` também funciona como link, sem sublinhado nem cor de link;
- o texto solto no rodapé dos cartões (`atlas-featureCardFooter`) usa tamanho
  e cor de texto de apoio, em vez de herdar 1rem.

## Conteúdo

Os 17 templates da tela Create são os do portal. O resto (serviços, squads,
chaves, notificações, incidentes) é conteúdo de exemplo, para as telas
aparecerem preenchidas.
