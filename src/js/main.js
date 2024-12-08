// Arquivo principal que coordena a aplicação
class App {
    constructor() {
        this.ui = new UI();
        this.api = new YouTubeAPI();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const searchForm = document.getElementById('searchForm');
        if (!searchForm) {
            console.error('Formulário de busca não encontrado');
            return;
        }

        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSearch();
        });

        // Adiciona listener para o input para limpar mensagens quando o usuário começa a digitar
        const urlInput = document.getElementById('urlInput');
        if (urlInput) {
            urlInput.addEventListener('input', () => {
                this.ui.clearMessages();
            });
        }
    }

    async handleSearch() {
        const urlInput = document.getElementById('urlInput');
        if (!urlInput) {
            console.error('Input de URL não encontrado');
            return;
        }

        const url = urlInput.value.trim();
        if (!url) {
            this.ui.showMessage('Por favor, insira uma URL do YouTube', 'error');
            return;
        }

        this.ui.showSpinner();
        this.ui.clearMessages();

        try {
            console.log('Iniciando busca para URL:', url);
            
            // Extrai o ID do vídeo
            const videoId = this.api.extractVideoId(url);
            if (!videoId) {
                throw new Error('URL do YouTube inválida');
            }

            console.log('ID do vídeo extraído:', videoId);

            // Busca os comentários
            const comments = await this.api.getVideoComments(videoId);
            
            if (!comments || comments.length === 0) {
                this.ui.showMessage('Nenhum comentário encontrado para este vídeo', 'info');
                return;
            }

            console.log(`${comments.length} comentários encontrados`);
            this.ui.displayComments(comments);
        } catch (error) {
            console.error('Erro durante a busca:', error);
            this.ui.showMessage(error.message, 'error');
        } finally {
            this.ui.hideSpinner();
        }
    }
}

// Inicializar o aplicativo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
