// Atualiza preview em tempo real
document.getElementById("nome").addEventListener("input", e => {
  document.getElementById("prevNome").textContent = e.target.value;
});
document.getElementById("profissao").addEventListener("input", e => {
  document.getElementById("prevProfissao").textContent = e.target.value;
});
document.getElementById("email").addEventListener("input", e => {
  document.getElementById("prevEmail").textContent = e.target.value;
});
document.getElementById("telefone").addEventListener("input", e => {
  document.getElementById("prevTelefone").textContent = e.target.value;
});

// Fundo personalizado
document.getElementById("bg").addEventListener("change", e => {
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById("frente").style.backgroundImage = `url(${reader.result})`;
      document.getElementById("verso").style.backgroundImage = `url(${reader.result})`;
    };
    reader.readAsDataURL(file);
  }
});

// Logo extra
document.getElementById("logo").addEventListener("change", e => {
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById("prevLogo").src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

// Exportar PDF frente e verso
document.getElementById("exportar").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  // Configurações da folha
  const larguraCartao = parseFloat(document.getElementById("largura").value);
  const alturaCartao = parseFloat(document.getElementById("altura").value);
  const colunas = parseInt(document.getElementById("colunas").value);
  const linhas = parseInt(document.getElementById("linhas").value);
  const margemEsq = parseFloat(document.getElementById("margemEsq").value);
  const margemTopo = parseFloat(document.getElementById("margemTopo").value);

  // Dados do cartão
  const nome = document.getElementById("nome").value;
  const profissao = document.getElementById("profissao").value;
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;

  // --- Página 1: Frente ---
  for (let linha = 0; linha < linhas; linha++) {
    for (let coluna = 0; coluna < colunas; coluna++) {
      const x = margemEsq + coluna * larguraCartao;
      const y = margemTopo + linha * alturaCartao;
      doc.rect(x, y, larguraCartao, alturaCartao);
      doc.text(nome, x + 10, y + 20);
      doc.text(profissao, x + 10, y + 30);
    }
  }

  // --- Página 2: Verso ---
  doc.addPage();
  for (let linha = 0; linha < linhas; linha++) {
    for (let coluna = 0; coluna < colunas; coluna++) {
      const x = margemEsq + coluna * larguraCartao;
      const y = margemTopo + linha * alturaCartao;
      doc.rect(x, y, larguraCartao, alturaCartao);
      doc.text(email, x + 10, y + 20);
      doc.text(telefone, x + 10, y + 30);
    }
  }

  doc.save("cartoes.pdf");
});
