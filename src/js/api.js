// Configuração e chamadas da API do YouTube
const API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
let currentPageToken = '';
let totalResults = 0;

class YouTubeAPI {
    constructor() {
        // Chave da API do YouTube
        this.apiKey = 'AIzaSyCWnKedYmWyTolhccOPn8tr7bXBi2IvK4E';
        this.baseUrl = 'https://www.googleapis.com/youtube/v3';
        this.cache = new Map();
    }

    async fetchComments(videoId, pageToken = '') {
        try {
            console.log('Fetching comments for video:', videoId);
            const cacheKey = `${videoId}-${pageToken}`;
            
            if (this.cache.has(cacheKey)) {
                console.log('Returning cached results');
                return this.cache.get(cacheKey);
            }

            const response = await axios.get(`https://www.googleapis.com/youtube/v3/commentThreads`, {
                params: {
                    part: 'snippet,replies',
                    videoId: videoId,
                    key: this.apiKey,
                    maxResults: 50,
                    pageToken: pageToken
                }
            });

            console.log('API Response:', response.data);

            const data = {
                items: response.data.items || [],
                nextPageToken: response.data.nextPageToken,
                totalResults: response.data.pageInfo?.totalResults || 0
            };

            this.cache.set(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw this.handleApiError(error);
        }
    }

    extractVideoId(url) {
        try {
            console.log('Tentando extrair ID do vídeo da URL:', url);
            
            // Tenta diferentes padrões de URL do YouTube
            const patterns = [
                /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
                /^[a-zA-Z0-9_-]{11}$/
            ];

            for (const pattern of patterns) {
                const match = url.match(pattern);
                if (match && match[1]) {
                    const videoId = match[1];
                    console.log('ID do vídeo extraído:', videoId);
                    return videoId;
                }
            }

            throw new Error('Não foi possível encontrar o ID do vídeo na URL fornecida');
        } catch (error) {
            console.error('Erro ao extrair ID do vídeo:', error);
            throw new Error('URL do YouTube inválida. Por favor, verifique e tente novamente.');
        }
    }

    async getVideoComments(videoId) {
        try {
            console.log('Buscando comentários para o vídeo:', videoId);
            
            // Primeiro, verifica se o vídeo existe
            const videoResponse = await this.fetchVideoDetails(videoId);
            if (!videoResponse.items || videoResponse.items.length === 0) {
                throw new Error('Vídeo não encontrado');
            }

            // Busca os comentários
            const commentThreadsResponse = await this.fetchCommentThreads(videoId);
            console.log('Resposta da API:', commentThreadsResponse);

            if (!commentThreadsResponse.items) {
                console.log('Nenhum comentário encontrado');
                return [];
            }

            const comments = commentThreadsResponse.items.map(item => {
                const comment = item.snippet.topLevelComment.snippet;
                const replies = item.replies ? item.replies.comments : [];

                return {
                    authorDisplayName: comment.authorDisplayName,
                    authorProfileImageUrl: comment.authorProfileImageUrl,
                    textDisplay: comment.textDisplay,
                    publishedAt: comment.publishedAt,
                    likeCount: comment.likeCount,
                    replies: replies.map(reply => ({
                        authorDisplayName: reply.snippet.authorDisplayName,
                        authorProfileImageUrl: reply.snippet.authorProfileImageUrl,
                        textDisplay: reply.snippet.textDisplay,
                        publishedAt: reply.snippet.publishedAt,
                        likeCount: reply.snippet.likeCount
                    }))
                };
            });

            console.log(`${comments.length} comentários encontrados`);
            return comments;
        } catch (error) {
            console.error('Erro ao buscar comentários:', error);
            if (error.response) {
                console.error('Resposta da API:', error.response);
                if (error.response.status === 403) {
                    throw new Error('Limite da API excedido ou chave inválida');
                }
            }
            throw new Error('Não foi possível carregar os comentários. ' + error.message);
        }
    }

    async fetchVideoDetails(videoId) {
        const url = `${this.baseUrl}/videos?part=snippet&id=${videoId}&key=${this.apiKey}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar detalhes do vídeo: ${response.status}`);
        }

        return response.json();
    }

    async fetchCommentThreads(videoId) {
        const url = `${this.baseUrl}/commentThreads?part=snippet,replies&videoId=${videoId}&key=${this.apiKey}&maxResults=100`;
        console.log('Fazendo requisição para:', url);
        
        const response = await fetch(url);
        console.log('Status da resposta:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro da API:', errorData);
            
            if (response.status === 403) {
                throw new Error('Limite da API excedido ou chave inválida');
            } else if (response.status === 404) {
                throw new Error('Vídeo não encontrado');
            } else {
                throw new Error(`Erro ao buscar comentários: ${errorData.error.message}`);
            }
        }

        return response.json();
    }

    handleApiError(error) {
        console.error('API Error:', error);
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data?.error?.message;
            
            switch (status) {
                case 400:
                    return new Error('ID do vídeo inválido');
                case 403:
                    return new Error('Quota da API excedida ou chave inválida');
                case 404:
                    return new Error('Vídeo não encontrado');
                default:
                    return new Error(message || 'Erro ao acessar a API do YouTube');
            }
        }
        return error;
    }
}

// Tornando a classe disponível globalmente
window.YouTubeAPI = YouTubeAPI;
