async function fetchComments() {
    const videoId = document.getElementById('videoIdInput').value;
    const apiKey = 'AIzaSyCWnKedYmWyTolhccOPn8tr7bXBi2IvK4E';
    const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}&maxResults=100`;

    spinner.classList.remove('d-none')

    try {
        const response = await fetch(url);
        const data = await response.json();

        spinner.classList.add('d-none');

        if (data.items && data.items.length > 0) {
            displayComments(data.items);
        } else {
            commentsList.innerHTML = '<li class="list-group-item">Não há comentários para este vídeo.</li>';
        }
    } catch (error) {
        console.error('Erro ao buscar comentários:', error);
        commentsList.innerHTML = '<li class="list-group-item">Falha ao buscar comentários. Tente novamente.</li>';
        
        spinner.classList.add('d-none');
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
            listItem.textContent = comment;
            commentsList.appendChild(listItem);
        });
    } else {
        commentsList.innerHTML = '<li class="list-group-item">Não há comentários para este vídeo.</li>';
        document.getElementById('downloadCsvButton').classList.add('d-none'); // Esconde o botão de download
    }
}


function handleEnter(event) {
    if (event.keyCode === 13) { 
        fetchComments();
    }
}

function downloadCommentsCsv() {
    const commentsList = document.getElementById('commentsList');
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Comentários\n"; // Cabeçalho do CSV

   
    commentsList.querySelectorAll('.list-group-item').forEach((item) => {
        let comment = item.textContent.replace(/(\r\n|\n|\r)/gm, " "); // Remove quebras de linha
        csvContent += `"${comment}"\n`; // Adiciona o comentário entre aspas para lidar com vírgulas no texto
    });

    // Cria um link para download do CSV
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "comentarios_youtube.csv");
    document.body.appendChild(link); // Necessário para o FF

    link.click(); // Inicia o download
    document.body.removeChild(link); // Limpa o link após o download
}

document.addEventListener('DOMContentLoaded', function () {
    const themeSwitch = document.getElementById('checkbox');
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    });
});