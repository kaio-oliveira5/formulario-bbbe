# Projeto BBBE – Bom de Bola Bom na Escola ⚽📄

Sistema web para **inscrição, validação escolar e geração de documento oficial em PDF** do projeto **Bom de Bola Bom na Escola**, desenvolvido para o município de **Carlos Barbosa – RS**.

O sistema automatiza todo o fluxo:
**Responsável → Escola → Secretaria**, garantindo segurança, integridade dos dados e rastreabilidade do processo.

---

## 🚀 Visão Geral

O Projeto BBBE permite:

- Inscrição online de alunos pelos responsáveis
- Coleta de dados completos do aluno (incluindo saúde e foto)
- Assinatura digital do responsável
- Validação e assinatura digital da escola
- Geração de **documento final em PDF**
- Envio automático de e-mails em cada etapa
- Controle de status no Firestore

Tudo sem papel, sem retrabalho e com histórico confiável.

---

## 🔄 Fluxo do Sistema

### 1️⃣ Responsável
- Preenche o formulário de inscrição
- Informa dados do aluno, responsáveis e saúde
- Assina digitalmente
- Envia o formulário

📌 Resultado:
- Dados salvos no Firestore
- Status: `aguardando_escola`
- E-mail enviado automaticamente para a escola

---

### 2️⃣ Escola
- Recebe um e-mail com link único
- Visualiza os dados do aluno
- Confere documento do responsável
- Assina digitalmente
- Confirma a inscrição

📌 Proteções:
- O link **só pode ser usado uma vez**
- Reenvio é bloqueado por regras e transação no Firestore

📌 Resultado:
- Status atualizado para `confirmado_escola`
- Documento final liberado

---

### 3️⃣ Secretaria
- Recebe e-mail automático
- Acessa o **documento final**
- Pode:
  - Visualizar no navegador
  - Baixar o PDF oficial (A4)

O PDF contém:
- Dados completos do aluno
- Foto
- Informações de saúde
- Responsáveis
- Assinaturas do responsável e da escola

---


## 🧠 Tecnologias Utilizadas

- **HTML5 / CSS3**
- **JavaScript (ES Modules)**
- **Firebase**
  - Firestore
  - Hosting
- **Google Apps Script**
  - Envio de e-mails
- **html2canvas**
- **jsPDF**
- **Canvas API**
  - Assinatura digital

---

## 🔐 Segurança e Confiabilidade

### Firestore Rules
- Modo teste **desativado**
- Regras explícitas para leitura e escrita
- Controle por status do documento

### Proteções implementadas
- Transações (`runTransaction`) no Firestore
- Bloqueio de reenvio após confirmação da escola
- Links únicos por inscrição
- Validação de assinatura obrigatória
- Escape de HTML em e-mails

---

## 📄 Documento Final (PDF)

- Layout A4
- Pré-visualização no navegador
- Download sob demanda
- Conteúdo fiel ao que está salvo no Firestore
- Ideal para arquivamento institucional

---

## 📧 E-mails Automáticos

- Escola recebe link de validação
- Secretaria recebe link do documento final
- Envio via Google Apps Script
- Não bloqueia o fluxo em caso de falha de e-mail

---

## 🛠️ Deploy

Hospedado em:
- **Firebase Hosting**

Após deploy:
- Sistema pronto para uso imediato
- Sem necessidade de backend próprio


## 📌 Observações Importantes

- O sistema foi pensado para ser:
  - reutilizável (outros projetos esportivos)
  - escalável
  - simples de manter
- Toda a lógica crítica está protegida no Firestore
- Interface pensada para uso em desktop, tablet e celular

---

## 👨‍💻 Autor

Projeto desenvolvido por **Kaio Oliveira**  
Sistema real, utilizado em contexto institucional.

---

## ✅ Status do Projeto

🟢 **Finalizado e pronto para produção**
