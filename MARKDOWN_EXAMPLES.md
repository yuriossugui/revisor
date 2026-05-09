# Exemplos de Markdown Suportados

Este arquivo demonstra todos os elementos Markdown suportados pelo sistema.

## Formatação de Texto

**Texto em negrito** e *texto em itálico* são suportados.

Você também pode combinar: ***negrito e itálico***.

## Títulos

# Título H1
## Título H2
### Título H3
#### Título H4
##### Título H5
###### Título H6

## Listas

### Lista não ordenada
- Item um
- Item dois
  - Item dois.um
  - Item dois.dois
- Item três

### Lista ordenada
1. Primeiro item
2. Segundo item
   1. Segundo.um
   2. Segundo.dois
3. Terceiro item

## Links

[Link para Google](https://google.com)

[Link para OpenAI](https://openai.com)

## Blocos de Código

### Código inline
Use `npm install` para instalar dependências.

### Bloco de código com linguagem
```javascript
function helloWorld() {
  console.log("Olá Mundo!");
  return true;
}
```

```python
def hello_world():
    print("Olá Mundo!")
    return True
```

```sql
SELECT * FROM users WHERE age > 18;
```

## Citações (Blockquotes)

> Esta é uma citação simples.
> 
> Pode ter múltiplas linhas.

> Uma citação aninhada:
> > Com uma citação dentro

## Linhas Horizontais

---

## Tabelas

| Recurso | Suporte | Status |
|---------|---------|--------|
| Negrito | ✓ | Funcionando |
| Itálico | ✓ | Funcionando |
| Headings | ✓ | Funcionando |
| Listas | ✓ | Funcionando |
| Links | ✓ | Funcionando |
| Código | ✓ | Funcionando |

## Quebras de Linha

Linhas são preservadas corretamente.

Você pode ter quebras de parágrafo
e o sistema mantém a formatação
original da resposta da API.

## Combinações

Você pode ter **negrito com `código inline`** e *itálico com links para [Google](https://google.com)*.

---

### Recursos Principais Implementados:

✓ Suporte a negrito (`**texto**`)
✓ Suporte a itálico (`*texto*`)
✓ Suporte a headings/títulos (`#`, `##`, etc.)
✓ Suporte a listas ordenadas e não ordenadas
✓ Suporte a links
✓ Suporte a blocos de código com syntax highlight
✓ Preservação de quebras de linha
✓ Sem exibição literal de tokens Markdown
✓ Sanitização adequada contra XSS
✓ Compatibilidade com mensagens existentes
✓ Boa performance na renderização
