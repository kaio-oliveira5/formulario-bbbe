📘 Leia este arquivo README em:
- 🇧🇷 Português (este arquivo)
- 🇮🇹 Italiano → [README.it.md](README.IT.md)


# ⚽ BBBE – Bom de Bola Bom na Escola

Sistema web institucional desenvolvido para o município de Carlos Barbosa – RS, responsável pela inscrição, validação escolar e geração automática de documentos oficiais em PDF do projeto **Bom de Bola Bom na Escola**.

✅ Sistema em produção
✅ Fluxo 100% digital
✅ Assinaturas digitais
✅ Integração com Firebase
✅ Geração automática de PDF
✅ Utilizado em contexto institucional

---

# 🚀 Visão Geral

O sistema BBBE foi desenvolvido para automatizar todo o processo de inscrição e validação dos alunos participantes do projeto esportivo municipal.

O fluxo digital elimina processos manuais e garante:

* Segurança dos dados
* Integridade das informações
* Rastreabilidade completa
* Redução de retrabalho
* Assinaturas digitais
* Geração automática de documentos oficiais

Todo o processo ocorre de forma online, conectando:

**Responsável → Escola → Secretaria**

---

# 🔄 Fluxo do Sistema

## 1️⃣ Responsável

O responsável realiza o preenchimento completo da inscrição do aluno.

### Informações coletadas:

* Dados pessoais do aluno
* Informações dos responsáveis
* Dados de saúde
* Foto do aluno
* Informações escolares

### Funcionalidades:

* Assinatura digital
* Envio automático
* Validação obrigatória dos campos

### Resultado:

* Dados armazenados no Firestore
* Status atualizado para:

```txt
aguardando_escola
```

* E-mail enviado automaticamente para a escola responsável

---

## 2️⃣ Escola

A escola recebe automaticamente um e-mail contendo um link único de validação.

### Funcionalidades:

* Visualização dos dados do aluno
* Conferência das informações
* Assinatura digital da escola
* Confirmação da inscrição

### Proteções implementadas:

* Link utilizável apenas uma vez
* Bloqueio de reenvio após confirmação
* Controle via transações do Firestore
* Validação por status do documento

### Resultado:

* Status atualizado para:

```txt
confirmado_escola
```

* Documento final liberado automaticamente

---

## 3️⃣ Secretaria

A secretaria recebe acesso ao documento final da inscrição.

### Funcionalidades:

* Visualização do documento no navegador
* Download do PDF oficial
* Controle e arquivamento institucional

### O PDF contém:

* Dados completos do aluno
* Informações dos responsáveis
* Dados do torneio
* Foto do aluno
* Assinaturas digitais
* Informações escolares

---

# 🧠 Tecnologias Utilizadas

| Frontend                | Serviços e Backend     |
| ----------------------- | ---------------------- |
| HTML5                   | Firebase               |
| CSS3                    | Firestore              |
| JavaScript (ES Modules) | Firebase Hosting       |
| API Canvas              | Google Apps Script     |
| html2canvas             | Envio de E-mails       |
| jsPDF                   | Armazenamento em Nuvem |

---

# 🔐 Segurança e Confiabilidade

O sistema foi desenvolvido com foco em integridade dos dados e segurança operacional.

## Proteções implementadas:

* Regras de segurança no Firestore
* Controle de leitura e escrita
* Bloqueio de reenvio após validação
* Links únicos por inscrição
* Transações com `runTransaction`
* Controle de status do documento
* Validação obrigatória de assinatura
* Escape de HTML em e-mails
* Fluxo protegido contra duplicidade

---

# 📄 Documento Final (PDF)

O sistema gera automaticamente um documento oficial em formato A4.

## Funcionalidades:

* Pré-visualização no navegador
* Download sob demanda
* Conteúdo fiel ao Firestore
* Layout institucional
* Compatível para arquivamento oficial

---

# 📧 Automação de E-mails

O sistema realiza envios automáticos em cada etapa do fluxo.

## Envio automático para:

* Escola responsável
* Secretaria municipal

## Recursos:

* Links dinâmicos
* Integração via Google Apps Script
* Fluxo resiliente a falhas de envio

---

# 🚧 Desafios Técnicos

Durante o desenvolvimento foram solucionados diversos desafios técnicos:

* Implementação de assinaturas digitais
* Controle de links únicos
* Proteção contra reenvios
* Geração de PDFs dinâmicos
* Controle de status em tempo real
* Garantia de integridade dos dados
* Fluxo multiusuário com validação

---

# 📱 Compatibilidade

O sistema foi desenvolvido para utilização em:

* Desktop
* Tablets
* Smartphones

Interface responsiva e adaptada para uso institucional.

---

# 🛠️ Deploy

Hospedado utilizando:

* Firebase Hosting

Após o deploy, o sistema fica pronto para uso imediato sem necessidade de infraestrutura própria.

---

# 📁 Estrutura do Projeto

```txt
/src
/components
/services
/firebase
/utils
/assets
```

---

# 👨‍💻 Meu Papel no Projeto

Responsável pelo desenvolvimento completo do sistema, incluindo:

* Estruturação do frontend
* Integração com Firebase
* Modelagem do Firestore
* Implementação das regras de segurança
* Geração automática de PDF
* Assinaturas digitais
* Automação de e-mails
* Controle de fluxo do sistema
* Deploy e publicação

---

# 📌 Objetivos do Projeto

O sistema foi pensado para ser:

* Reutilizável
* Escalável
* Seguro
* Simples de manter
* Adaptável para outros projetos esportivos

---

# 📸 Imagens do Sistema

## Tela de Inscrição

<!-- Adicionar print -->

## Validação Escolar

<!-- Adicionar print -->

## Documento Final em PDF

<!-- Adicionar print -->

---

# 👨‍💻 Autor

Desenvolvido por **Kaio Oliveira**

Sistema real utilizado em contexto institucional para o município de Carlos Barbosa – RS.

---

# ✅ Status do Projeto

🟢 Finalizado e em produção
