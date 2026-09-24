# Atlas Design System

O visual do portal Atlas num único CSS, para reutilizar em qualquer tela HTML —
sem framework, sem build, sem depender do Backstage.

**Tudo num arquivo só: `index.html`.** Ele é a documentação e também carrega o
CSS do design system, embutido no bloco `<style id="atlas-css">`.

Para reutilizar numa tela, copie o conteúdo desse bloco `<style>` para um
`atlas.css` (ou cole direto no `<head>` da sua página).

## Ver a documentação

Dá para abrir o `index.html` direto com dois cliques. Os botões de copiar
funcionam melhor servindo por `http://`:

```bash
python -m http.server 4200
```

e acesse http://localhost:4200. O botão no topo alterna entre tema escuro e
claro; o código de cada exemplo é gerado a partir do próprio exemplo, então a
documentação não tem como divergir do que está renderizado.

## Usar numa tela

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="atlas.css">

<body class="atlas-root" data-theme="dark">
  <main class="atlas-appContainer">
    <section class="atlas-sectionCard">
      <div class="atlas-sectionCardHeader">
        <h3 class="atlas-sectionCardTitle">Minha tela</h3>
      </div>
      <button class="atlas-btnPill atlas-btnPillLime">Ação principal</button>
    </section>
  </main>
</body>
```

Três regras:

1. **Componentes vão dentro de `.atlas-root`.** É nele que as variáveis de cor
   são definidas; fora dele os componentes ficam sem cor. Como toda classe
   começa com `atlas-`, dá para colocar um bloco Atlas dentro de uma página
   existente sem colidir com o CSS dela.
2. **Tema por atributo:** `data-theme="dark"` (padrão) ou `data-theme="light"`.
3. **Cor por variável, nunca por hex:** `color: var(--text-secondary)`. É a
   variável que troca de valor entre os temas.

Sem a fonte Inter (rede bloqueada, por exemplo), o CSS cai em Segoe UI e Arial
sem quebrar layout.

## Origem

O CSS embutido junta os dois arquivos de tema do portal Atlas
(`atlas-ds.css`, o port do redesign, e `atlas-refinements.css`, o acabamento).
Uma diferença deliberada: no portal a barra de navegação é sempre fixa; aqui
ela fica no fluxo por padrão e vira fixa com o modificador
`atlas-topNav--fixed`, porque numa tela solta isso é escolha de quem monta.

**A partir de agora este repositório é a fonte da verdade.** Mudou algo no
visual? Mude aqui, e depois leve para o portal — não o contrário.

## Versões

Mudança de visual que não quebra marcação existente → versão menor (`v1.1`).
Classe renomeada ou removida → versão maior (`v2.0`), com a lista do que mudou
na descrição da tag. Quem consome fixa a versão pela tag do Git.
