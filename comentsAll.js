let allComments = []; // Armazena todos os comentários

async function fetchComments(pageToken = '') {
    const videoId = document.getElementById('videoIdInput').value;
    const apiKey = 'AIzaSyCWnKedYmWyTolhccOPn8tr7bXBi2IvK4E'; // Substitua pela sua chave de API válida
    let url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}&maxResults=100`;

    if (pageToken) {
        url += `&pageToken=${pageToken}`; // Adiciona o token de paginação se houver
    }

    const spinner = document.getElementById('spinner');
    const progressMessage = document.getElementById('progressMessage');
    const totalComments = document.getElementById('totalComments');
    spinner.classList.remove('d-none');
    progressMessage.classList.remove('d-none');
    progressMessage.textContent = 'Carregando comentários...';

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            allComments = allComments.concat(data.items); // Acumula os comentários

            // Atualiza a exibição dos comentários já carregados
            displayComments(allComments);
            totalComments.classList.remove('d-none');
            totalComments.textContent = `Total de comentários carregados: ${allComments.length}`;

            // Verifica se há mais páginas de comentários
            if (data.nextPageToken) {
                // Espera 1 segundo antes de buscar a próxima página
                setTimeout(async () => {
                    await fetchComments(data.nextPageToken); // Requisição recursiva para a próxima página
                }, 500);
            } else {
                spinner.classList.add('d-none');
                progressMessage.textContent = 'Todos os comentários foram carregados.';
            }
        } else {
            spinner.classList.add('d-none');
            commentsList.innerHTML = '<li class="list-group-item">Não há comentários para este vídeo.</li>';
        }
    } catch (error) {
        console.error('Erro ao buscar comentários:', error);
        commentsList.innerHTML = '<li class="list-group-item">Falha ao buscar comentários. Tente novamente.</li>';
        spinner.classList.add('d-none');
        progressMessage.classList.add('d-none');
    }
}

function displayComments(commentThreads) {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = ''; // Limpa a lista de comentários anteriores

    if (commentThreads.length > 0) {
        const downloadButton = document.getElementById('downloadCsvButton');
        downloadButton.classList.remove('d-none'); // Mostra o botão de download

        commentThreads.forEach(item => {
            const comment = item.snippet.topLevelComment.snippet.textDisplay;
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.textContent = cleanComment(comment); // Limpa o comentário
            commentsList.appendChild(listItem);
        });
    } else {
        commentsList.innerHTML = '<li class="list-group-item">Não há comentários para este vídeo.</li>';
        document.getElementById('downloadCsvButton').classList.add('d-none'); // Esconde o botão de download
    }
}

// Função para limpar o comentário, removendo HTML e caracteres especiais
function cleanComment(comment) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = comment; // Converte o HTML
    return tempDiv.textContent || tempDiv.innerText || ''; // Retorna o texto limpo
}

function downloadCommentsCsv() {
    let csvContent = "Comentários\n"; // Cabeçalho do CSV

    allComments.forEach((item) => {
        const comment = cleanComment(item.snippet.topLevelComment.snippet.textDisplay).replace(/(\r\n|\n|\r)/gm, " "); // Remove quebras de linha e limpa o HTML
        csvContent += `"${comment}"\n`; // Adiciona o comentário entre aspas para lidar com vírgulas no texto
    });

    // Verifica se o conteúdo é muito grande e divide em blocos, se necessário
    if (csvContent.length > 50000) { // Limite de tamanho ajustável, dependendo do navegador
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "comentarios_youtube.csv");
        document.body.appendChild(link);
        link.click(); // Inicia o download
        document.body.removeChild(link); // Remove o link após o download
    } else {
        // Cria um link para download diretamente
        const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "comentarios_youtube.csv");
        document.body.appendChild(link); // Necessário para Firefox

        link.click(); // Inicia o download
        document.body.removeChild(link); // Remove o link após o download
    }
}


function handleEnter(event) {
    if (event.keyCode === 13) {
        fetchComments();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    const videoIdInput = document.getElementById('videoIdInput');

    // Permite buscar ao pressionar Enter
    videoIdInput.addEventListener('keydown', handleEnter);
});
