// TODO: Substitua pela URL do seu backend de produção.
const API_URL = 'https://armeirot.vercel.app'; 

// Variável para guardar o token. Em uma aplicação real, você pode querer
// um método mais robusto para persistir o login entre sessões.
let userToken = null;

// --- FUNÇÕES DE LOGIN ---

async function pedirCodigo() {
  const emailInput = document.getElementById('inputEmail');
  const email = emailInput.value;

  if (!email) {
    alert("Por favor, insira um e-mail válido.");
    return;
  }
  
  try {
    const res = await fetch(`${API_URL}/auth/request-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      alert(data.message || "Código enviado! Verifique seu e-mail (ou o console do servidor).");
    } else {
      throw new Error(data.error || 'Falha ao solicitar código.');
    }
  } catch (error) {
    alert(`Erro: ${error.message}`);
  }
}

async function fazerLogin() {
  const email = document.getElementById('inputEmail').value;
  const code = document.getElementById('inputCodigo').value;

  if (!email || !code) {
    alert("Por favor, preencha o e-mail e o código.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });

    const data = await res.json();
    
    if (data.token) {
      userToken = data.token; // Salva o token
      alert("Login realizado com sucesso!");
      document.getElementById('divUpload').style.display = 'block';
      document.getElementById('divLogin').style.display = 'none';
    } else {
      throw new Error(data.error || 'Código errado!');
    }
  } catch(error) {
    alert(`Erro: ${error.message}`);
  }
}

// --- FUNÇÃO DE UPLOAD ---

async function enviarImagem() {
  if (!userToken) return alert("Você precisa fazer login antes de enviar!");
  
  const fileInput = document.getElementById('inputFile');
  const file = fileInput.files[0];
  if (!file) {
    alert("Por favor, selecione um arquivo.");
    return;
  }

  try {
    // 1. Pede a URL assinada para o Backend
    console.log("Pedindo URL assinada...");
    const signRes = await fetch(`${API_URL}/upload/sign`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}` 
      },
      body: JSON.stringify({ 
        fileType: file.type,
        fileName: file.name 
      })
    });

    const signData = await signRes.json();
    if (!signRes.ok) throw new Error(signData.error || 'Falha ao obter URL de upload.');
    
    const { uploadURL, finalUrl } = signData;
    console.log("URL recebida. Fazendo upload para o R2...");

    // 2. Envia o arquivo DIRETO para a Cloudflare (PUT)
    const uploadRes = await fetch(uploadURL, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file // Envia o arquivo bruto (blob)
    });

    if (uploadRes.ok) {
      console.log("Upload concluído com sucesso!");
      document.getElementById('preview').src = finalUrl;
      alert("Upload realizado com sucesso!");
      
      // Opcional: Chamar o backend para salvar a `finalUrl` no perfil do usuário
      // await fetch(`${API_URL}/profile/update-avatar`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ avatarUrl: finalUrl })
      // });

    } else {
      throw new Error('Erro no upload para o R2. Verifique o CORS do bucket.');
    }
  } catch (error) {
    alert(`Erro no processo de upload: ${error.message}`);
    console.error(error);
  }
}
