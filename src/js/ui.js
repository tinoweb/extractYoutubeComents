class UI {
    constructor() {
        this.messageContainer = document.getElementById('messageContainer');
        this.spinner = document.getElementById('spinner');
        this.resultsContainer = document.getElementById('results');
        this.commentsContainer = document.getElementById('commentsContainer');
        this.resultsHeader = document.getElementById('resultsHeader');
        this.downloadControls = document.getElementById('downloadControls');
        this.paginationContainer = document.getElementById('pagination');
        this.FREE_LIMIT = 20; // Limite de comentários na versão gratuita
    }

    showMessage(message, type = 'info') {
        if (!this.messageContainer) {
            console.error('Container de mensagens não encontrado');
            return;
        }

        const alertClass = `alert-${type === 'error' ? 'danger' : type}`;
        this.messageContainer.innerHTML = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    clearMessages() {
        if (this.messageContainer) {
            this.messageContainer.innerHTML = '';
        }
    }

    showSpinner() {
        if (this.spinner) {
            this.spinner.style.display = 'block';
        }
    }

    hideSpinner() {
        if (this.spinner) {
            this.spinner.style.display = 'none';
        }
    }

    displayComments(comments) {
        if (!this.resultsContainer || !this.commentsContainer) {
            console.error('Container de resultados não encontrado');
            return;
        }

        this.resultsContainer.style.display = 'block';
        
        if (!comments || comments.length === 0) {
            this.showMessage('Nenhum comentário encontrado para este vídeo.', 'info');
            return;
        }

        // Limpa o container de comentários
        this.commentsContainer.innerHTML = '';

        // Atualiza o cabeçalho com o total de comentários
        if (this.resultsHeader) {
            this.resultsHeader.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4>
                        <i class="fas fa-comments me-2"></i>
                        ${comments.length} Comentários encontrados
                    </h4>
                    <span class="badge bg-primary">
                        Mostrando ${Math.min(this.FREE_LIMIT, comments.length)} de ${comments.length}
                    </span>
                </div>
            `;
        }

        // Pega apenas os primeiros 20 comentários
        const displayComments = comments.slice(0, this.FREE_LIMIT);

        // Adiciona os cards de comentários limitados
        displayComments.forEach(comment => {
            const commentCard = this.createCommentCard(comment);
            this.commentsContainer.appendChild(commentCard);
        });

        // Se houver mais comentários, mostra o card PRO
        if (comments.length > this.FREE_LIMIT) {
            const remainingComments = comments.length - this.FREE_LIMIT;
            const proCard = document.createElement('div');
            proCard.className = 'card border-primary mb-4';
            proCard.innerHTML = `
                <div class="card-body text-center py-5">
                    <h4 class="card-title mb-4">
                        <i class="fas fa-crown text-warning me-2"></i>
                        Desbloqueie mais ${remainingComments} comentários!
                    </h4>
                    <p class="card-text mb-4">
                        A versão gratuita está limitada a ${this.FREE_LIMIT} comentários.
                        <br>Atualize para a versão PRO e tenha acesso a:
                    </p>
                    <div class="row justify-content-center mb-4">
                        <div class="col-md-8">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">
                                    <i class="fas fa-check text-success me-2"></i>
                                    Todos os ${comments.length} comentários deste vídeo
                                </li>
                                <li class="list-group-item">
                                    <i class="fas fa-check text-success me-2"></i>
                                    Exportação para Excel, CSV e PDF
                                </li>
                                <li class="list-group-item">
                                    <i class="fas fa-check text-success me-2"></i>
                                    Análise de sentimentos dos comentários
                                </li>
                                <li class="list-group-item">
                                    <i class="fas fa-check text-success me-2"></i>
                                    Suporte prioritário
                                </li>
                            </ul>
                        </div>
                    </div>
                    <a href="sales.html" 
                       class="btn btn-primary btn-lg pulse-button">
                        <i class="fas fa-crown me-2"></i>
                        Obter Versão PRO
                    </a>
                    <div class="mt-3">
                        <small class="text-muted">Acesso vitalício por apenas R$ 69,90</small>
                    </div>
                </div>
            `;
            this.commentsContainer.appendChild(proCard);
        }
    }

    createCommentCard(comment) {
        const card = document.createElement('div');
        card.className = 'card mb-3';
        
        const formattedDate = new Date(comment.publishedAt).toLocaleDateString('pt-BR');
        
        card.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                    <img src="${comment.authorProfileImageUrl}" alt="${comment.authorDisplayName}" 
                         class="rounded-circle me-2" style="width: 40px; height: 40px;">
                    <div>
                        <h6 class="card-subtitle mb-1">${comment.authorDisplayName}</h6>
                        <small class="text-muted">${formattedDate}</small>
                    </div>
                </div>
                <p class="card-text">${comment.textDisplay}</p>
                <div class="d-flex align-items-center mt-2">
                    <small class="text-muted me-3">
                        <i class="fas fa-thumbs-up me-1"></i>${comment.likeCount}
                    </small>
                    <small class="text-muted">
                        <i class="fas fa-reply me-1"></i>${comment.replies ? comment.replies.length : 0}
                    </small>
                </div>
            </div>
        `;

        return card;
    }
}

// Tornando a classe disponível globalmente
window.UI = UI;
