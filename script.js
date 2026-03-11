// Atualiza preview em tempo real
["nome","profissao","email","telefone"].forEach(id => {
  document.getElementById(id).addEventListener("input", e => {
    document.getElementById("prev" + id.charAt(0).toUpperCase() + id.slice(1)).textContent = e.target.value;
    salvarLocal();
  });
});

// Função para remover fundo branco de uma imagem
function removerFundoBranco(imgSrc, callback) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      if (data[i] > 240 && data[i+1] > 240 && data[i+2] > 240) {
        data[i+3] = 0; // torna transparente
      }
    }

    ctx.putImageData(imageData, 0, 0);
    callback(canvas.toDataURL("image/png"));
  };
  img.src = imgSrc;
}

// Fundo personalizado
document.getElementById("bg").addEventListener("change", e => {
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById("frente").style.backgroundImage = `url(${reader.result})`;
      document.getElementById("verso").style.backgroundImage = `url(${reader.result})`;
      salvarLocal();
    };
    reader.readAsDataURL(file);
  }
});

// Logos extras com remoção de fundo branco
function carregarLogo(inputId, imgId){
  document.getElementById(inputId).addEventListener("change", e => {
    const file = e.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = () => {
        removerFundoBranco(reader.result, (novoSrc) => {
          const img = document.getElementById(imgId);
          img.src = novoSrc;
          img.style.display = "block";
          salvarLocal();
        });
      };
      reader.readAsDataURL(file);
    }
  });
}
carregarLogo("logo1","prevLogo1"); // frente
carregarLogo("logo2","prevLogo2"); // verso

// Função para tornar elementos arrastáveis
function makeDraggable(el) {
  let offsetX, offsetY;
  el.onmousedown = function(e) {
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    document.onmousemove = function(ev) {
      el.style.left = (ev.pageX - el.parentElement.offsetLeft - offsetX) + "px";
      el.style.top = (ev.pageY - el.parentElement.offsetTop - offsetY) + "px";
    };
    document.onmouseup = function() {
      document.onmousemove = null;
      salvarLocal();
    };
  };
}
makeDraggable(document.getElementById("prevLogo1"));
makeDraggable(document.getElementById("prevLogo2"));

// Salvar localmente
function salvarLocal() {
  const dados = {
    nome: document.getElementById("nome").value,
    profissao: document.getElementById("profissao").value,
    email: document.getElementById("email").value,
    telefone: document.getElementById("telefone").value,
    fundoFrente: document.getElementById("frente").style.backgroundImage,
    fundoVerso: document.getElementById("verso").style.backgroundImage,
    logo1: {
      src: document.getElementById("prevLogo1").src,
      left: document.getElementById("prevLogo1").style.left,
      top: document.getElementById("prevLogo1").style.top
    },
    logo2: {
      src: document.getElementById("prevLogo2").src,
      left: document.getElementById("prevLogo2").style.left,
      top: document.getElementById("prevLogo2").style.top
    }
  };
  localStorage.setItem("cartaoDados", JSON.stringify(dados));
}

function carregarLocal() {
  const dados = JSON.parse(localStorage.getItem("cartaoDados"));
  if(dados){
    document.getElementById("nome").value = dados.nome || "";
    document.getElementById("profissao").value = dados.profissao || "";
    document.getElementById("email").value = dados.email || "";
    document.getElementById("telefone").value = dados.telefone || "";

    document.getElementById("prevNome").textContent = dados.nome || "";
    document.getElementById("prevProfissao").textContent = dados.profissao || "";
    document.getElementById("prevEmail").textContent = dados.email || "";
    document.getElementById("prevTelefone").textContent = dados.telefone || "";

    if(dados.fundoFrente) document.getElementById("frente").style.backgroundImage = dados.fundoFrente;
    if(dados.fundoVerso) document.getElementById("verso").style.backgroundImage = dados.fundoVerso;

    if(dados.logo1){
      const l1 = document.getElementById("prevLogo1");
      l1.src = dados.logo1.src || "";
      l1.style.left = dados.logo1.left || "0px";
      l1.style.top = dados.logo1.top || "0px";
    }
    if(dados.logo2){
      const l2 = document.getElementById("prevLogo2");
      l2.src = dados.logo2.src || "";
      l2.style.left = dados.logo2.left || "0px";
      l2.style.top = dados.logo2.top || "0px";
    }
  }
}

// Exportar para TXT
function exportarTXT() {
  const dados = [
    document.getElementById("nome").value,
    document.getElementById("profissao").value,
    document.getElementById("email").value,
    document.getElementById("telefone").value
  ].join("\n");

  const blob = new Blob([dados], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "cartao.txt";
  link.click();
}

// Importar de TXT
function importarTXT(file) {
  const reader = new FileReader();
  reader.onload = function() {
    const linhas = reader.result.split("\n");
    document.getElementById("nome").value = linhas[0] || "";
    document.getElementById("profissao").value = linhas[1] || "";
    document.getElementById("email").value = linhas[2] || "";
    document.getElementById("telefone").value = linhas[3] || "";

    document.getElementById("prevNome").textContent = linhas[0] || "";
    document.getElementById("prevProfissao").textContent = linhas[1] || "";
    document.getElementById("prevEmail").textContent = linhas[2] || "";
    document.getElementById("prevTelefone").textContent = linhas[3] || "";

    salvarLocal();
  };
  reader.readAsText(file);
}

// Excluir fundo
document.getElementById("btnExcluirFundo").addEventListener("click", () => {
  document.getElementById("frente").style.backgroundImage = "";
  document.getElementById("verso").style.backgroundImage = "";
  salvarLocal();
});

// Excluir logo frente
document.getElementById("btnExcluirLogo1").addEventListener("click", () => {
  const logo1 = document.getElementById("prevLogo1");
  logo1.src = "";
  logo1.style.left = "0px";
  logo1.style.top = "0px";
  salvarLocal();
});

// Excluir logo verso
document.getElementById("btnExcluirLogo2").addEventListener("click", () => {
  const logo2 = document.getElementById("prevLogo2");
  logo2.src = "";
  logo2.style.left = "0px";
  logo2.style.top = "0px";
  salvarLocal();
});

// Eventos TXT
document.getElementById("btnExportTXT").addEventListener("click", exportarTXT);
document.getElementById("btnImportTXT").addEventListener("change", e => {
  importarTXT(e.target.files[0]);
});

// Carregar dados ao abrir
window.onload = carregarLocal;

// Função auxiliar para extrair base64 do background
function extrairBase64(bgStyle) {
  if (!bgStyle || bgStyle === "none") return null;
  return bgStyle.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
}

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

  // Ajuste do verso
  const offsetX = parseFloat(document.getElementById("offsetX").value);
  const offsetY = parseFloat(document.getElementById("offsetY").value);

  // Dados do cartão
  const nome = document.getElementById("nome").value;
  const profissao = document.getElementById("profissao").value;
  const email = document.getElementById("email").value;
  const telefone = document.getElementById("telefone").value;

  // Imagens
  const fundoFrente = extrairBase64(document.getElementById("frente").style.backgroundImage);
  const fundoVerso = extrairBase64(document.getElementById("verso").style.backgroundImage);
  const logo1 = document.getElementById("prevLogo1");
  const logo2 = document.getElementById("prevLogo2");

  // --- Página 1: Frente ---
  for (let linha = 0; linha < linhas; linha++) {
    for (let coluna = 0; coluna < colunas; coluna++) {
      const x = margemEsq + coluna * larguraCartao;
      const y = margemTopo + linha * alturaCartao;

      // Fundo da frente
      if (fundoFrente) {
        doc.addImage(fundoFrente, "PNG", x, y, larguraCartao, alturaCartao);
      }

      // Texto frente
      doc.text(nome, x + 10, y + 20);
      // Quebra de linha na profissão
      const profLinhas = profissao.split("\n");
      profLinhas.forEach((linhaTexto, idx) => {
        doc.text(linhaTexto, x + 10, y + 30 + (idx * 6));
      });

      // Logo 1 (frente)
      if (logo1.src) {
        const posX = x + (parseInt(logo1.style.left) || 0);
        const posY = y + (parseInt(logo1.style.top) || 0);
        doc.addImage(logo1.src, "PNG", posX, posY, 20, 20);
      }
    }
  }

  // --- Página 2: Verso ---
  doc.addPage();
  for (let linha = 0; linha < linhas; linha++) {
    for (let coluna = 0; coluna < colunas; coluna++) {
      const x = margemEsq + coluna * larguraCartao + offsetX;
      const y = margemTopo + linha * alturaCartao + offsetY;

      // Fundo do verso
      if (fundoVerso) {
        doc.addImage(fundoVerso, "PNG", x, y, larguraCartao, alturaCartao);
      }

      // Texto verso
      doc.text(email, x + 10, y + 20);
      doc.text(telefone, x + 10, y + 30);

      // Logo 2 (verso)
      if (logo2.src) {
        const posX = x + (parseInt(logo2.style.left) || 0);
        const posY = y + (parseInt(logo2.style.top) || 0);
        doc.addImage(logo2.src, "PNG", posX, posY, 20, 20);
      }
    }
  }

  // Salvar PDF
  doc.save("cartoes.pdf");
});
