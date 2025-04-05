document.addEventListener("DOMContentLoaded", () => {
    let currentColumn = null;
    let editCard = null;
    let selectedImage = null;
    let draggedCard = null; // Armazena o card arrastado

    // Abre o modal ao clicar no botão "+"
    document.querySelectorAll(".add-card").forEach(button => {
        button.addEventListener("click", function () {
            currentColumn = this.closest(".kanban-column").querySelector(".kanban-cards");
            editCard = null;
            selectedImage = "src/images/perfil.jpg";
            openModal();
        });
    });

    // Abre o modal ao clicar no ícone de edição (pincel)
    document.addEventListener("click", (e) => {
        if (e.target.closest(".edit-btn")) {
            editCard = e.target.closest(".kanban-card");
            selectedImage = editCard.querySelector(".user img").src;
            openModal(editCard);  // Chama o modal para editar o card
        }
    });

    // Fecha o modal
    document.getElementById("close-modal").addEventListener("click", () => {
        document.getElementById("modal").style.display = "none";
    });

    // Captura imagem ao escolher arquivo
    document.getElementById("card-image-file").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                selectedImage = e.target.result;
                document.getElementById("preview-image").src = selectedImage;
            };
            reader.readAsDataURL(file);
        }
    });

    // Salva o card (novo ou editado)
    document.getElementById("save-card").addEventListener("click", () => {
        const title = document.getElementById("card-title-input").value;
        const priority = document.getElementById("card-priority-input").value;

        if (!title.trim()) {
            alert("O título do card não pode estar vazio!");
            return;
        }

        if (editCard) {
            // Atualiza um card existente
            editCard.querySelector(".card-title").textContent = title;
            editCard.querySelector(".badge").className = `badge ${priority}`;
            editCard.querySelector(".badge span").textContent = formatPriority(priority);
            editCard.querySelector(".user img").src = selectedImage;
        } else {
            // Cria um novo card
            const newCard = document.createElement("div");
            newCard.classList.add("kanban-card");
            newCard.setAttribute("draggable", "true");

            newCard.innerHTML = `
                <div class="badge ${priority}">
                    <span>${formatPriority(priority)}</span>
                </div>
                <p class="card-title">${title}</p>
                <div class="card-infos">
                    <div class="card-icons">
                        <p><i class="fa-regular fa-comment"></i></p>
                        <button class="edit-btn">
                            <i class="fa-solid fa-paintbrush"></i>
                        </button>
                        <button class="delete-card">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                    <div class="user">
                        <img src="${selectedImage}" alt="Avatar">
                    </div>
                </div>
            `;

            currentColumn.appendChild(newCard);
            setupDragAndDrop();
        }

        document.getElementById("modal").style.display = "none";
    });

    // Abre o modal e preenche os campos caso seja uma edição
    function openModal(card = null) {
        if (card) {
            document.getElementById("card-title-input").value = card.querySelector(".card-title").textContent;
            document.getElementById("card-priority-input").value = card.querySelector(".badge").classList[1];
            document.getElementById("preview-image").src = selectedImage;
        } else {
            document.getElementById("card-title-input").value = "";
            document.getElementById("card-priority-input").value = "low";
            document.getElementById("preview-image").src = "src/images/default.jpg";
        }

        document.getElementById("modal").style.display = "flex";
    }

    // Formata a prioridade para texto
    function formatPriority(priority) {
        return priority === "high" ? "Alta Prioridade" : priority === "medium" ? "Média Prioridade" : "Baixa Prioridade";
    }

    // Configuração de arrastar e soltar
    function setupDragAndDrop() {
        document.querySelectorAll('.kanban-card').forEach(card => {
            card.addEventListener('dragstart', e => {
                e.currentTarget.classList.add('dragging');
            })
        
            card.addEventListener('dragend', e =>{
                e.currentTarget.classList.remove('dragging');
            })
        })
        
        document.querySelectorAll('.kanban-cards').forEach(column => {
            column.addEventListener('dragover', e => {
                e.preventDefault();
                e.currentTarget.classList.add('cards-hover');
            })
        
            column.addEventListener('dragleave', e => {
                e.currentTarget.classList.remove('cards-hover');
            })
        
            column.addEventListener('drop', e => {
                e.currentTarget.classList.remove('cards-hover');
        
                const dragCard = document.querySelector('.kanban-card.dragging');
                e.currentTarget.appendChild(dragCard);
            })
        })
    }

    setupDragAndDrop();

    // Lógica para deletar cards
    document.addEventListener("click", function (event) {
        if (event.target.closest(".delete-card")) {
            const card = event.target.closest(".kanban-card");
            card.remove(); // Remove o card do DOM
        }
    });
});
