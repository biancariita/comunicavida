# 📱 ComunicaVida

Sistema de comunicação assistiva desenvolvido para auxiliar pacientes com mobilidade extremamente limitada, como tetraplegia associada ao uso de traqueostomia.

O projeto permite comunicação através de movimento da cabeça e piscadas, utilizando apenas a câmera frontal do celular e o navegador.

---

## 💙 Objetivo

Oferecer uma solução acessível e de baixo custo que devolva autonomia e comunicação para pessoas com dificuldades motoras severas.

Este projeto representa a união entre duas áreas: **Saúde e Tecnologia**, aplicadas para gerar impacto real.

---

## 🚀 Como funciona

- Utiliza a câmera frontal do dispositivo
- Detecta pontos do rosto em tempo real (Face Mesh)
- Move o cursor com o movimento da cabeça
- Seleciona opções por piscada
- Possui tempo de espera de 5 segundos entre cliques para evitar ativações acidentais
- Inclui sistema de calibração para adaptar à posição do paciente (deitado, sentado ou inclinado)
- Converte o texto selecionado em voz automática

Tudo funciona diretamente no navegador, sem necessidade de hardware especializado.

---

## 🛠 Tecnologias utilizadas

- JavaScript
- MediaPipe Face Mesh
- Web Speech API
- HTML5
- CSS3
- GitHub Pages

---

## 📦 Estrutura do Projeto

/comunicavida
│── index.html
│── style.css
│── script.js


---

## ▶️ Como executar localmente

1. Clone o repositório:
git clone https://github.com/biancariita/comunicavida.git


2. Entre na pasta:
cd comunicavida


3. Rode com um servidor local (exemplo com serve):
npx serve .


4. Abra no navegador.

---

## 📱 Compatibilidade

- Android (funcionamento validado)
- iOS (em adaptação devido às limitações do Safari)

---

## 🔧 Próximas melhorias

- Versão otimizada para iPhone
- Ajuste automático de sensibilidade
- Melhorias de performance
- Versão offline completa

---

## 🤝 Contribuição

Sugestões e melhorias são bem-vindas.

---

## 📄 Licença

Projeto de caráter educacional e social.
